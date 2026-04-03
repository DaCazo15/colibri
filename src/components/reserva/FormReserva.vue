<script setup>
import { ref, watch, onMounted } from 'vue'
import config from '@/helpers/config'
import objetos from '@/helpers/objetos'
import FormHospedajeExtra from './FormReservaExtra.vue'
import { useSupabase } from '../../composables/useSupa'
import useSection from '@/composables/useSection'

const { setItem, getTable } = useSupabase()
const { setSection } = useSection()

const submitting = ref(false)
const data = ref([])

onMounted(async () => {
  data.value = await getTable('habitaciones')
})

// Vigilante para acompañantes
watch(
  () => objetos.reserva.cantidad_personas,
  (newVal) => {
    const acompañantesNecesarios = newVal - 1
    while (objetos.reserva.demas.length < acompañantesNecesarios) {
      objetos.reserva.demas.push({ nombre: '', apellido: '', cedula: '', telefono: '' })
    }
    if (objetos.reserva.demas.length > acompañantesNecesarios) {
      objetos.reserva.demas.splice(acompañantesNecesarios)
    }
  },
  { immediate: true },
)

const labelClass = 'block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2'

const clear = () => {
  // Reseteo profundo para asegurar limpieza
  objetos.reserva.encargado = ''
  objetos.reserva.encargado_apellido = ''
  objetos.reserva.encargado_cedula = ''
  objetos.reserva.encargado_telefono = ''
  objetos.reserva.habitacion = ''
  objetos.reserva.fecha_reserva = ''
  objetos.reserva.fecha_entrada = ''
  objetos.reserva.fecha_salida = ''
  objetos.reserva.cantidad_personas = 1
  objetos.reserva.metodode_pago = 'Transferencia'
  objetos.reserva.facturacion = ''
  objetos.reserva.demas = []
}

// Función para limpiar strings vacíos y evitar errores de Postgres (DATE/INT)
const cleanData = (obj) => {
  const cleaned = { ...obj }
  for (const key in cleaned) {
    if (cleaned[key] === '') cleaned[key] = null
  }
  return cleaned
}

const asignarHistorial = (reserva) => {
  // Buscamos la habitación comparando la concatenación, no el ID
  const habSeleccionada = data.value.find(
    (h) => `${h.numero_habitacion}${h.torre}` === reserva.habitacion,
  )

  const nombreHab = habSeleccionada
    ? `${habSeleccionada.numero_habitacion}${habSeleccionada.torre}`
    : reserva.habitacion

  console.log(nombreHab)
  Object.assign(objetos.usu_historial_reserva, {
    name_huesped: `${reserva.encargado} ${reserva.encargado_apellido}`,
    cedula_identidad: reserva.encargado_cedula,
    habitacion: nombreHab, // Aquí se guarda el string "101A"
    fecha_reserva: reserva.fecha_reserva,
    reserva: reserva,
    servicio: [],
    inventario_habitacion: [],
    multa: [],
    temporada: false,
    facturacion: [],
  })
}

const guardarReserva = async () => {
  if (submitting.value) return

  // Validación mínima: debe haber una habitación seleccionada
  if (Object.values(objetos.reserva).includes('')) {
    alert('Existen campos sin llenar')
    return
  }
  console.log(objetos.reserva.habitacion)
  submitting.value = true

  try {
    // 1. Preparamos el historial
    asignarHistorial(objetos.reserva)

    // 2. Limpiamos los datos de la reserva para evitar el error de "date: '' "
    const reservaLimpia = cleanData(objetos.reserva)

    // 3. Ejecutamos las inserciones
    const [resHuesped, resHistorial] = await Promise.all([
      setItem('huesped', reservaLimpia),
      setItem('usu_historial_reserva', objetos.usu_historial_reserva),
    ])

    if (resHuesped.success && resHistorial.success) {
      clear()
      setSection('huespedes')
    } else {
      console.error('Error en el proceso de guardado')
    }
  } catch (e) {
    console.error('Error inesperado:', e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-full bg-[#0f172a]">
    <div class="max-w-full w-full table-auto divide-y divide-gray-200">
      <form class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#1f2937] p-8 rounded-2xl shadow-2xl">
        <div class="md:col-span-2 border-b border-gray-700 pb-2">
          <h3 class="text-blue-400 font-bold uppercase text-sm">
            Información del Huésped Representante
          </h3>
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Nombre del Huésped</label>
          <input
            type="text"
            :class="config.inputClass"
            placeholder="Nombre"
            v-model="objetos.reserva.encargado"
          />
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Apellido del Huésped</label>
          <input
            type="text"
            :class="config.inputClass"
            placeholder="Apellido"
            v-model="objetos.reserva.encargado_apellido"
          />
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Cedula del Huésped</label>
          <input
            type="text"
            :class="config.inputClass"
            placeholder="Cedula"
            v-model="objetos.reserva.encargado_cedula"
          />
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Teléfono del Huésped</label>
          <input
            type="text"
            :class="config.inputClass"
            placeholder="Teléfono"
            v-model="objetos.reserva.encargado_telefono"
          />
        </div>

        <div class="md:col-span-2 border-b border-gray-700 pb-2 mt-4">
          <h3 class="text-blue-400 font-bold uppercase text-sm">Tamaño de la Reserva</h3>
        </div>
        <div class="flex flex-col">
          <label :class="labelClass">Nro. de Personas</label>
          <input
            type="number"
            min="1"
            step="1"
            v-model="objetos.reserva.cantidad_personas"
            :class="config.inputClass"
          />
        </div>
        <div class="flex flex-col">
          <label :class="labelClass">Nro. de habitacion</label>
          <select v-model="objetos.reserva.habitacion" :class="config.inputClass">
            <option value="">-- Seleccione --</option>
            <option
              v-for="value in data"
              :key="value.id"
              :value="`${value.numero_habitacion}${value.torre}`"
            >
              {{ value.numero_habitacion }}{{ value.torre }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2 border-b border-gray-700 pb-2 mt-4">
          <h3 class="text-blue-400 font-bold uppercase text-sm">Reserva</h3>
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Fecha de Reserva</label>
          <input type="date" v-model="objetos.reserva.fecha_reserva" :class="config.inputClass" />
        </div>

        <div class="md:col-span-2 border-b border-gray-700 pb-2 mt-4">
          <h3 class="text-blue-400 font-bold uppercase text-sm">check in y check out</h3>
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Hora de Check In</label>
          <label class="py-3 px-4 bg-gray-400 text-gray-200 rounded-lg">3:00 PM</label>
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Hora de Check Out</label>
          <label class="py-3 px-4 bg-gray-400 text-gray-200 rounded-lg">12:00 PM</label>
        </div>

        <div class="md:col-span-2 border-b border-gray-700 pb-2 mt-4">
          <h3 class="text-blue-400 font-bold uppercase text-sm">Estadía y Pago</h3>
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Fecha de Entrada</label>
          <input type="date" v-model="objetos.reserva.fecha_entrada" :class="config.inputClass" />
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Fecha de Salida</label>
          <input type="date" v-model="objetos.reserva.fecha_salida" :class="config.inputClass" />
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Método de Pago</label>
          <select v-model="objetos.reserva.metodode_pago" :class="config.inputClass">
            <option value="">-- Seleccione --</option>
            <option>Efectivo</option>
            <option>Punto de Venta</option>
            <option>Transferencia</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label :class="labelClass">Facturación</label>
          <input type="date" v-model="objetos.reserva.facturacion" :class="config.inputClass" />
        </div>

        <div class="md:col-span-2 pt-4 flex flex-row gap-5">
          <button
            type="button"
            @click="guardarReserva"
            :disabled="submitting"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/40 uppercase tracking-tighter text-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Reserva
          </button>
          <button
            type="button"
            @click="clear"
            class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-900/40 uppercase tracking-tighter text-lg active:scale-95"
          >
            Limpiar Reserva
          </button>
        </div>
      </form>
      <div v-if="objetos.reserva.cantidad_personas > 1">
        <div class="bg-gray-800 h-auto w-full my-8 p-8 rounded-2xl flex flex-col gap-8">
          <div
            v-for="i in objetos.reserva.cantidad_personas - 1"
            :key="i"
            class="bg-[#1f2937] p-8 rounded-2xl shadow-xl border border-gray-700"
          >
            <h3 class="text-blue-400 font-bold uppercase text-xs mb-4">Acompañante #{{ i }}</h3>

            <FormHospedajeExtra
              v-model="objetos.reserva.demas[i - 1]"
              :labelClass="labelClass"
              :inputClass="config.inputClass"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

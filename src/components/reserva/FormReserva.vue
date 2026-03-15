<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import config from '@/helpers/config'
import FormHospedajeExtra from './FormReservaExtra.vue'
import { useSupabase } from '../../composables/useSupa'
import useSection from '@/composables/useSection'

const { setItem, getTable, supabase } = useSupabase()
const { setSection } = useSection()
const submitting = ref(false)
const reserva = reactive({
  // Datos del Huésped Representante
  encargado: '',
  encargado_apellido: '',
  encargado_cedula: '',
  encargado_telefono: '',

  // Datos de la Reserva
  check_in: '3:00:00 PM',
  check_out: '12:00:00 PM',
  habitacion: '',
  fecha_reserva: '',
  fecha_entrada: '',
  fecha_salida: '',
  cantidad_personas: 1,
  metodode_pago: 'Transferencia',
  facturacion: '',
  // Datos de acompañantes (Array de objetos)
  demas: [],
})

const data = ref([])

onMounted(async () => {
  data.value = await getTable('habitaciones')
})

watch(
  () => reserva.cantidad_personas,
  (newVal) => {
    const acompañantesNecesarios = newVal - 1

    while (reserva.demas.length < acompañantesNecesarios) {
      reserva.demas.push({ nombre: '', apellido: '', cedula: '', telefono: '' })
    }

    if (reserva.demas.length > acompañantesNecesarios) {
      reserva.demas.splice(acompañantesNecesarios)
    }
  },
  { immediate: true },
)

const labelClass = 'block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2'
const clear = () => {
  reserva.encargado = ''
  reserva.encargado_apellido = ''
  reserva.encargado_cedula = ''
  reserva.encargado_telefono = ''
  reserva.habitacion = ''
  reserva.fecha_reserva = ''
  reserva.fecha_entrada = ''
  reserva.fecha_salida = ''
  reserva.cantidad_personas = 1
  reserva.metodode_pago = 'Transferencia'
  reserva.facturacion = ''
  reserva.demas = []
}
const guardarReserva = async () => {
  if (submitting.value) return
  submitting.value = true
  console.log(reserva)
  const result = await setItem('huesped', reserva)
  if (result.success) {
    // Update the room status to 'Reservado'
    const { error } = await supabase
      .from('habitaciones')
      .update({ estatus: 'Reservado' })
      .eq('id', reserva.habitacion)
    if (error) {
      console.error('Error updating room status:', error.message)
    } else {
      clear()
      setSection('huespedes')
    }
  }
  submitting.value = false
}
</script>

<template>
  <div class="min-h-screen w-full px-4 bg-[#0f172a]">
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
            v-model="reserva.encargado"
          />
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Apellido del Huésped</label>
          <input
            type="text"
            :class="config.inputClass"
            placeholder="Apellido"
            v-model="reserva.encargado_apellido"
          />
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Cedula del Huésped</label>
          <input
            type="text"
            :class="config.inputClass"
            placeholder="Cedula"
            v-model="reserva.encargado_cedula"
          />
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Teléfono del Huésped</label>
          <input
            type="text"
            :class="config.inputClass"
            placeholder="Teléfono"
            v-model="reserva.encargado_telefono"
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
            v-model="reserva.cantidad_personas"
            :class="config.inputClass"
          />
        </div>
        <div class="flex flex-col">
          <label :class="labelClass">Nro. de habitacion</label>
          <select v-model="reserva.habitacion" :class="config.inputClass">
            <option value="">-- Seleccione --</option>
            <option v-for="value in data" :key="value.id" :value="value.id">
              {{ value.numero_habitacion }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2 border-b border-gray-700 pb-2 mt-4">
          <h3 class="text-blue-400 font-bold uppercase text-sm">Reserva</h3>
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Fecha de Reserva</label>
          <input type="date" v-model="reserva.fecha_reserva" :class="config.inputClass" />
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
          <input type="date" v-model="reserva.fecha_entrada" :class="config.inputClass" />
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Fecha de Salida</label>
          <input type="date" v-model="reserva.fecha_salida" :class="config.inputClass" />
        </div>

        <div class="flex flex-col">
          <label :class="labelClass">Método de Pago</label>
          <select v-model="reserva.metodode_pago" :class="config.inputClass">
            <option value="">-- Seleccione --</option>
            <option>Efectivo</option>
            <option>Punto de Venta</option>
            <option>Transferencia</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label :class="labelClass">Facturación</label>
          <input type="date" v-model="reserva.facturacion" :class="config.inputClass" />
        </div>

        <div class="md:col-span-2 pt-4 flex flex-row gap-5">
          <button
            type="button"
            @click="guardarReserva"
            :disabled="submitting"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-900/40 uppercase tracking-tighter text-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar Reserva
          </button>
          <button
            type="button"
            @click="clear"
            class="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-900/40 uppercase tracking-tighter text-lg active:scale-95"
          >
            Limpiar Reserva
          </button>
        </div>
      </form>
      <div v-if="reserva.cantidad_personas > 1">
        <div class="bg-gray-800 h-auto w-full my-8 p-8 rounded-2xl flex flex-col gap-8">
          <div
            v-for="i in reserva.cantidad_personas - 1"
            :key="i"
            class="bg-[#1f2937] p-8 rounded-2xl shadow-xl border border-gray-700"
          >
            <h3 class="text-blue-400 font-bold uppercase text-xs mb-4">Acompañante #{{ i }}</h3>

            <FormHospedajeExtra
              v-model="reserva.demas[i - 1]"
              :labelClass="labelClass"
              :inputClass="config.inputClass"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

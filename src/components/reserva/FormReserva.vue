<script setup>
import { reactive, watch } from 'vue'
import config from '@/helpers/config'
import FormHospedajeExtra from './FormReservaExtra.vue'
import { useSupabase } from '../../composables/useSupa'
import useSection from '@/composables/useSection'

const { setTable } = useSupabase()
const { setSection } = useSection()
const reserva = reactive({
  // Datos del Huésped Representante
  encargado: '',
  encargado_apellido: '',
  encargado_cedula: '',
  encargado_telefono: '',

  // Datos de la Reserva
  habitacion: '',
  fecha_entrada: '',
  fecha_salida: '',
  cantidad_personas: 1,
  metodode_pago: 'Transferencia',
  facturacion: '',
  // Datos de acompañantes (Array de objetos)
  demas: [],
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
  Object.assign(reserva, '')
  reserva.demas = []
  reserva.cantidad_personas = 1
}
const guardarReserva = async () => {
  console.log(reserva)
  setTable('huesped', reserva).then(() => {
    clear()
  })
}
</script>

<template>
  <div class="min-h-screen w-full px-4 bg-[#0f172a]">
    <div class="max-w-full w-full table-auto divide-y divide-gray-200">
      <form
        @submit.prevent="guardarReserva"
        class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#1f2937] p-8 rounded-2xl shadow-2xl"
      >
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
            <option>Transferencia</option>
          </select>
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
            <option>Transferencia</option>
            <option>Efectivo</option>
            <option>Punto de Venta</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label :class="labelClass">Facturación</label>
          <input type="date" v-model="reserva.facturacion" :class="config.inputClass" />
        </div>

        <div class="md:col-span-2 pt-4 flex flex-row gap-5">
          <button
            type="submit"
            @click="setSection('huespedes')"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-900/40 uppercase tracking-tighter text-lg active:scale-95"
          >
            Confirmar Reserva
          </button>
          <button
            type="submit"
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

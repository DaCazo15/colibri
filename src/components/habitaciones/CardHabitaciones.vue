<script setup>
import { onMounted, ref } from 'vue'
import { useSupabase } from '@/composables/useSupa'

const { getTable } = useSupabase()
const habitaciones = ref([])

const props = defineProps({
  habitacionesFiltradas: Array,
  habitacionesLibres: Array,
  editar: Boolean,
})
console.log(props.editar)
const emit = defineEmits(['idHabitacion', 'selectHabitacion'])

onMounted(async () => {
  const data = await getTable('habitaciones')
  if (data) {
    habitaciones.value = data.sort(
      (a, b) => parseInt(a.numero_habitacion) - parseInt(b.numero_habitacion),
    )
  }
})

const seleccionar = (hab) => {
  const identificador = `${hab.numero_habitacion}${hab.torre}`
  emit('selectHabitacion', identificador)
  emit('idHabitacion', hab.id)
}

const estaOcupada = (numeroHabitacion, torre) => {
  const reserva = props.habitacionesFiltradas?.find(
    (res) => res.habitacion === `${numeroHabitacion}${torre}`,
  )
  const fechaEntrada = new Date(reserva?.reserva.fecha_entrada.replace(/-/g, '/'))
  const hoy = new Date()

  fechaEntrada.setHours(0, 0, 0, 0)
  hoy.setHours(0, 0, 0, 0)

  if (hoy >= fechaEntrada) return true
}
const estaSalida = (numeroHabitacion, torre) => {
  const reserva = props.habitacionesFiltradas?.find(
    (res) => res.habitacion === `${numeroHabitacion}${torre}`,
  )
  const fechaSalida = new Date(reserva?.reserva.fecha_salida.replace(/-/g, '/'))
  const hoy = new Date()

  fechaSalida.setHours(0, 0, 0, 0)
  hoy.setHours(0, 0, 0, 0)

  if (hoy.getTime() === fechaSalida.getTime()) return true
}

const claseHabitacion = (hab) => {
  const estaReservada = props.habitacionesFiltradas?.some(
    (res) => res.habitacion === `${hab.numero_habitacion}${hab.torre}`,
  )

  if (hab.estatus !== 'Disponible') {
    return 'bg-orange-800/50 border-orange-800'
  }
  if (estaSalida(hab.numero_habitacion, hab.torre)) {
    return 'bg-red-950/50 border-red-950'
  }
  if (estaOcupada(hab.numero_habitacion, hab.torre)) {
    return 'bg-green-900/50 border-green-700'
  }
  if (estaReservada) {
    return 'bg-blue-950/50 border-blue-950'
  }
  return 'bg-gray-800/50 border-gray-800'
}
</script>

<template>
  <div
    :class="{
      'w-30 grid grid-cols-1 gap-5': !editar,
      'w-full grid grid-cols-4 gap-5': editar,
    }"
  >
    <div
      v-for="hab in habitaciones"
      :key="hab.id"
      :class="`rounded-xl p-3 cursor-pointer active:scale-95 border hover:border-slate-400 transition-all ease-in-out duration-150 ${claseHabitacion(hab)}`"
      @click="seleccionar(hab)"
    >
      <p class="font-bold text-2xl text-center uppercase text-slate-100">
        {{ hab.numero_habitacion }}{{ hab.torre }}
      </p>
    </div>
  </div>
</template>

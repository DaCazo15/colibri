<script setup>
import { onMounted, watch, reactive, ref, computed } from 'vue'
import { useSupabase } from '@/composables/useSupa'
import CardHabitaciones from './CardHabitaciones.vue'
import SectionHuesped from './SectionHuesped.vue'

const { getTable } = useSupabase()
const habitaciones = ref([])
const items = ref([])
const itemsFiltrados = ref({})
const habitacionesFiltradas = ref([])
const habitacionesFiltradasLibres = ref([])

const emit = defineEmits(['idHabitacion'])

const data = reactive({
  fecha: '',
  habitacion: '',
})

const mensaje = computed(() => {
  return data.fecha ? 'habitación con reserva' : 'fecha'
})

watch(
  () => [data.fecha, data.habitacion],
  ([nuevaFecha, nuevaHabitacion]) => {
    if (nuevaFecha || nuevaHabitacion) {
      filtrado(nuevaFecha, nuevaHabitacion)
    }
  },
)

onMounted(async () => {
  const [resItems, resHab] = await Promise.all([
    getTable('usu_historial_reserva'),
    getTable('habitaciones'),
  ])

  if (resItems) items.value = resItems
  if (resHab) {
    habitaciones.value = resHab.sort(
      (a, b) => parseInt(a.numero_habitacion) - parseInt(b.numero_habitacion),
    )
  }
})

const selectHabitacion = (value) => {
  data.habitacion = value
}
const filtrado = (fecha = null, habitacion = null) => {
  habitacionesFiltradas.value = items.value.filter((item) => {
    return item.fecha_reserva === fecha
  })
  habitacionesFiltradasLibres.value = habitaciones.value.filter((hab) => {
    return !habitacionesFiltradas.value.some(
      (item) => item.habitacion === `${hab.numero_habitacion}${hab.torre}`,
    )
  })
  if (!fecha || !habitacion) {
    itemsFiltrados.value = null
    return
  }

  itemsFiltrados.value =
    items.value.find((item) => item.fecha_reserva === fecha && item.habitacion === habitacion) ??
    null
}
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full gap-5">
    <div class="flex flex-row justify-between items-center w-full p-5 rounded-xl bg-gray-800">
      <p class="text-xl text-white font-semibold">Selecciona una fecha:</p>
      <input
        type="date"
        v-model="data.fecha"
        class="py-2 px-4 text-2xl font-semibold bg-gray-200 rounded-xl uppercase"
      />
    </div>
    <div class="flex flex-row justify-baseline w-full gap-5">
      <CardHabitaciones
        v-if="data.fecha"
        @selectHabitacion="selectHabitacion"
        @idHabitacion="(id) => emit('idHabitacion', id)"
        :habitacionesFiltradas="habitacionesFiltradas"
        :habitacionesLibres="habitacionesFiltradasLibres"
      />
      <SectionHuesped :data="data" :itemsFiltrados="itemsFiltrados" :mensaje="mensaje" />
    </div>
  </div>
</template>

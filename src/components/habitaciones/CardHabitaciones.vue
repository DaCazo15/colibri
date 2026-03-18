<script setup>
import { onMounted, ref } from 'vue'
import { useSupabase } from '@/composables/useSupa'

const { getTable } = useSupabase()
const habitaciones = ref([])

const props = defineProps({
  habitacionesFiltradas: Array,
})

const emit = defineEmits(['selectHabitacion'])

onMounted(async () => {
  const data = await getTable('habitaciones')
  if (data) {
    habitaciones.value = data.sort(
      (a, b) => parseInt(a.numero_habitacion) - parseInt(b.numero_habitacion),
    )
  }
})

// Función para manejar el click de forma más limpia
const seleccionar = (hab) => {
  // Enviamos el objeto o el string según lo que necesite tu lógica
  const identificador = `${hab.numero_habitacion}${hab.torre}`
  emit('selectHabitacion', identificador)
}
</script>

<template>
  <div class="w-30 grid grid-cols-1 gap-5">
    <div
      v-for="hab in habitaciones"
      :key="hab.id"
      class="rounded-xl p-3 cursor-pointer active:scale-95 border hover:border-slate-400 transition-all ease-in-out duration-150"
      :class="{
        // .some() devuelve true si al menos una reserva coincide con esta habitación
        'bg-blue-950 border-blue-950': props.habitacionesFiltradas?.some(
          (res) => res.habitacion === `${hab.numero_habitacion}${hab.torre}`,
        ),
        'bg-gray-800 border-gray-800': !props.habitacionesFiltradas?.some(
          (res) => res.habitacion === `${hab.numero_habitacion}${hab.torre}`,
        ),
      }"
      @click="seleccionar(hab)"
    >
      <p class="font-bold text-2xl text-center uppercase text-slate-100">
        {{ hab.numero_habitacion }}{{ hab.torre }}
      </p>
    </div>
  </div>
</template>

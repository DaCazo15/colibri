<script setup>
import { onMounted, ref } from 'vue'
import { useSupabase } from '@/composables/useSupa'
import CardHabitaciones from './CardHabitaciones.vue'

const { getTable } = useSupabase()
const habitaciones = ref([])

onMounted(async () => {
  const data = await getTable('habitaciones')
  if (data) {
    habitaciones.value = data.sort(
      (a, b) => parseInt(a.numero_habitacion) - parseInt(b.numero_habitacion),
    )
  }
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full gap-5">
    <div class="flex flex-row justify-between items-center w-full p-5 rounded-xl bg-gray-800">
      <p class="text-xl text-white font-semibold">Selecciona una fecha:</p>
      <input
        type="date"
        class="py-2 px-4 text-2xl font-semibold bg-gray-200 rounded-xl uppercase"
      />
    </div>
    <div class="flex flex-row justify-baseline w-full">
      <CardHabitaciones />
      <div class="flex flex-col w-full items-center">
        <p class="text-xl text-white font-semibold">holaholaaaa</p>
      </div>
    </div>
  </div>
</template>

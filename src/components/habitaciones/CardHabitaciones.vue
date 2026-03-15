<script setup>
import { onMounted, ref } from 'vue'
import { useSupabase } from '@/composables/useSupa'
// import { useRouter, useRoute } from 'vue-router'

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

// const route = useRoute()
// const cabioRuta = useRouter()

const selectHabitacion = async (id) => {
  console.log('hola', id)
}
</script>

<template>
  <div class="w-30 grid grid-cols-1 gap-5">
    <div
      v-for="hab in habitaciones"
      :key="hab.id"
      class="w-full rounded-xl p-3 bg-gray-800 border-4 border-gray-800 cursor-pointer active:scale-95 hover:border-slate-400 transition-all ease-in-out duration-150"
      @click="selectHabitacion(hab.id)"
    >
      <p class="font-bold text-2xl text-center uppercase text-slate-100">
        {{ hab.numero_habitacion }}{{ hab.torre }}
      </p>
    </div>
  </div>
</template>

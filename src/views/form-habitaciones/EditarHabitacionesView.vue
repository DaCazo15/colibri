<script setup>
import { reactive, ref, onMounted } from 'vue'
import config from '@/helpers/config'
import { useSupabase } from '@/composables/useSupa'
import { useRouter, useRoute } from 'vue-router'
import { useToken } from '@/composables/useToken'

const props = defineProps({
  page: { type: String },
})
const { generarHash } = useToken()
const { updateTable, getSelectRow } = useSupabase()
const cambioRuta = useRouter()
const route = useRoute()
const datos = ref('')

onMounted(async () => {
  const res = await getSelectRow('habitaciones', route.query.idHabitacion, 'id')
  if (res) {
    Object.assign(habitacion, res)
    datos.value = res
  }
})

const habitacion = reactive({
  numero_habitacion: '',
  torre: '',
  tipo_habitacion: '',
  piso: '',
  estatus: '',
})

const handleSubmit = async () => {
  try {
    await updateTable('habitaciones', route.query.idHabitacion, habitacion)
    cambioRuta.push({
      name: 'center-panel',
      query: {
        email: `${(await generarHash(route.query.email)).slice(0, (Math.random() * 10).toFixed())}-private[${route.query.email.slice(0, 1)}]`,
        rol: `${(await generarHash(route.query.rol)).slice(0, (Math.random() * 10).toFixed())}-private[${route.query.rol.slice(0, 1).toLowerCase()}]`,
      },
      params: { user: route.query.rol?.toLowerCase() },
      state: { email: route.query.email, rol: route.query.rol },
    })
  } catch (error) {
    console.error('Error al guardar habitación:', error)
    alert('Error: comprueba los campos y la conexión.')
  }
}
const back = async () => {
  cambioRuta.push({
    name: 'center-panel',
    query: {
      email: `${(await generarHash(route.query.email)).slice(0, (Math.random() * 10).toFixed())}-private[${route.query.email.slice(0, 1)}]`,
      rol: `${(await generarHash(route.query.rol)).slice(0, (Math.random() * 10).toFixed())}-private[${route.query.rol.slice(0, 1).toLowerCase()}]`,
    },
    params: { user: route.query.rol.toLowerCase() },
    state: { email: route.query.email, rol: route.query.rol },
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10">
    <div
      class="relative max-w-4xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-70"
    >
      <button
        @click="back"
        class="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-700 transition-colors group"
        title="Volver"
      >
        <img
          src="../../assets/icons/volver.png"
          alt="volver"
          class="w-6 h-6 invert opacity-70 group-hover:opacity-100 transition-opacity"
        />
      </button>
      <div class="mb-8 border-b border-gray-100 pb-6">
        <h2 class="text-3xl font-extrabold text-gray-50 tracking-tight">{{ props.page }}</h2>
        <p class="text-gray-50 mt-1">Registro de habitaciones — Colibrí System</p>
      </div>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Número</label
          >
          <input
            v-model="habitacion.numero_habitacion"
            type="text"
            placeholder="Ej. 101"
            :class="config.inputClass"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest">Piso</label>
          <select v-model="habitacion.piso" :class="config.inputClass">
            <option value="">-- Seleccione --</option>
            <option>P1</option>
            <option>P2</option>
            <option>P3</option>
            <option>P4</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest">Tipo</label>
          <select v-model="habitacion.tipo_habitacion" :class="config.inputClass">
            <option value="">-- Seleccione --</option>
            <option>Sencilla</option>
            <option>Doble</option>
            <option>Suite</option>
            <option>Deposito</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Torre</label
          >
          <select v-model="habitacion.torre" :class="config.inputClass">
            <option value="">-- Seleccione --</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Estatus</label
          >
          <select v-model="habitacion.estatus" :class="config.inputClass">
            <option value="">-- Seleccione --</option>
            <option value="Disponible">Disponible</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Limpieza">Limpieza</option>
          </select>
        </div>

        <div class="md:col-span-2 pt-4">
          <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-gray-50 font-black py-4 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] uppercase tracking-tighter text-lg"
          >
            Añadir Habitación
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

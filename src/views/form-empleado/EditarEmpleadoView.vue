<script setup>
import { ref, onMounted, reactive } from 'vue'
import config from '@/helpers/config'
import { useRoute, useRouter } from 'vue-router'
import { useSupabase } from '@/composables/useSupa'
import { useToken } from '@/composables/useToken'

const { generarHash } = useToken()
const { updateTable, getSelectTable } = useSupabase()

const empleado = ref({})
const cambioRuta = useRouter()
const ruta = useRoute()
const props = defineProps({
  page: { type: String },
})
const datos = reactive({
  email: history.state.email,
  rol: history.state.rol,
})

onMounted(async () => {
  empleado.value = await getSelectTable('empleado', ruta.params.id)
})

const handleSubmit = () => {
  updateTable('empleado', ruta.params.id, empleado.value).then(() =>
    cambioRuta.push({
      name: 'center-panel',
      query: { email: ruta.query.email, rol: ruta.query.rol },
      params: { user: ruta.query.rol.toLowerCase() },
    }),
  )
}
const back = async () => {
  console.log(ruta)
  cambioRuta.push({
    name: 'center-panel',
    query: {
      email: `${(await generarHash(ruta.query.email)).slice(0, (Math.random() * 10).toFixed())}-private[${ruta.query.email.slice(0, 1)}]`,
      rol: `${(await generarHash(ruta.query.rol)).slice(0, (Math.random() * 10).toFixed())}-private[${ruta.query.rol.slice(0, 1).toLowerCase()}]`,
    },
    params: { user: ruta.query.rol.toLowerCase() },
    state: { email: datos.email, rol: datos.rol },
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
        <p class="text-gray-50 mt-1">Gestión interna de talento humano — Colibrí System</p>
      </div>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Nombres</label
          >
          <input
            v-model="empleado.nombre"
            type="text"
            placeholder="Ej. Juan Pérez"
            :class="config.inputClass"
            required
          />
        </div>
        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Apellidos</label
          >
          <input
            v-model="empleado.apellido"
            type="text"
            placeholder="Ej. Juan Pérez"
            :class="config.inputClass"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest">Rol</label>
          <select v-model="empleado.rol" :class="config.inputClass">
            <option v-for="rol in config.roles" :key="rol" :value="rol">
              {{ rol }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Cédula</label
          >
          <input
            v-model="empleado.cedula"
            type="text"
            placeholder="V-00.000.000"
            :class="config.inputClass"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Fecha de Nacimiento</label
          >
          <input
            v-model="empleado.fechaNacimiento"
            type="date"
            :class="config.inputClass"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Email</label
          >
          <input
            v-model="empleado.email"
            type="text"
            placeholder="nombre@dominio.com"
            :class="config.inputClass"
            required
          />
        </div>
        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Teléfono</label
          >
          <input
            v-model="empleado.telefono"
            type="text"
            placeholder="+58 412..."
            :class="config.inputClass"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Salario Mensual (USD)</label
          >
          <div class="relative">
            <span class="absolute left-3 top-2.5 text-gray-400">$</span>
            <input
              v-model="empleado.salario"
              type="number"
              step="0.01"
              placeholder="0.00"
              :class="[config.inputClass, 'pl-7']"
              required
            />
          </div>
        </div>

        <div class="space-y-2 md:col-span-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Dirección de Habitación</label
          >
          <textarea
            v-model="empleado.direccion"
            rows="2"
            placeholder="Ubicación exacta..."
            :class="[config.inputClass, 'resize-none']"
          ></textarea>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Turno Laboral</label
          >
          <select v-model="empleado.turno" :class="config.inputClass">
            <option v-for="turno in config.turnos" :key="turno" :value="turno">
              {{ turno }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
            >Departamento / Área</label
          >
          <input
            v-model="empleado.area"
            type="text"
            placeholder="Sistemas / IA"
            :class="config.inputClass"
            required
          />
        </div>

        <div class="md:col-span-2 pt-4">
          <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-gray-50 font-black py-4 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] uppercase tracking-tighter text-lg"
          >
            Finalizar Registro
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

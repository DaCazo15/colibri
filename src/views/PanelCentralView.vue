<script setup>
import { onMounted, ref, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabase } from '@/composables/useSupa'

import RouterLink from '@/components/RouterLink.vue'
import useSection from '@/composables/useSection'

import ListarEmpleados from '@/components/empleados/ListarEmpleados.vue'
import OpcionesComponent from '@/components/OpcionesComponent.vue'
import FormReserva from '@/components/reserva/FormReserva.vue'
import ListarHuesped from '@/components/huesped/ListarHuesped.vue'

const { getTable, deleteRow } = useSupabase()
const { section, setSection } = useSection()

const router = useRouter()
const ruta = useRoute()
const sesionOn = ref(false)

const { email, rol } = ruta.query
const empleados = ref({})
const buscar = ref('')
const datos = reactive({
  email: history.state.email,
  rol: history.state.rol,
})

onMounted(async () => {
  verificarSesion()
  empleados.value = await getTable('empleado')
  if (ruta.query.rol === 'RECEPCIONISTA') setSection('reservas')
  if (ruta.query.rol === 'EMPLEADO') setSection('servicios')
  if (!ruta.query.rol === 'EMPLEADO' || !ruta.query.rol === 'RECEPCIONISTA') setSection('personal')
})
const eliminarEmpleado = async (id) => {
  if (confirm('¿Estás seguro de eliminar este empleado?')) {
    await deleteRow('empleado', id)
  }
}
const zuli = (x) => {
  return x && x.length > 31 && ruta.query.rol && ruta.query.email && ruta.params.user
}

const verificarSesion = () => {
  const token = localStorage.getItem('token')
  if (zuli(token)) {
    sesionOn.value = true
  } else {
    cerrarSesion()
  }
}

watch(() => ruta.path, verificarSesion)

const cerrarSesion = () => {
  localStorage.removeItem('token')
  sesionOn.value = false
  router.push({ name: 'login', replace: true })
}
</script>

<template>
  <div v-if="ruta.query" class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <!-- header -->
    <header class="bg-[#1f2937] shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-3">
            <!-- logo placeholder -->
            <div
              class="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm"
            >
              <span class="text-white font-bold text-lg">C</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-50 tracking-tight">Colibri</h1>
          </div>
          <!-- opciones usuario -->
          <div class="flex items-center gap-4">
            <div class="hidden md:flex flex-col items-end">
              <span class="text-sm font-semibold text-gray-200">{{ datos.rol }}</span>
              <span class="text-xs text-gray-50">{{ datos.email }}</span>
            </div>
            <div class="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
            <button class="p-2 cursor-pointer" @click="cerrarSesion">
              <img
                src="../assets/icons/salir.png"
                alt="opciones"
                class="w-6 h-6 invert hover:invert-50 transition-colors"
              />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- contenido -->
    <main class="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-5 items-start">
        <aside class="w-full lg:w-64 shrink-0">
          <OpcionesComponent
            @setSection="setSection"
            :section="section"
            :rol="rol"
            v-if="section"
          />
        </aside>
        <section v-if="section.personal" class="flex-1 w-full min-w-0">
          <div class="w-full flex justify-end gap-3 items-center">
            <input
              type="text"
              v-model="buscar"
              placeholder="Buscar..."
              class="py-3 px-3 w-full bg-transparent border-2 border-blue-700 text-blue-700 rounded-lg mb-5 focus:outline-none focus:text-white"
            />
            <RouterLink to="agregar-empleado" :query="{ email: email, rol: rol }">
              Agregar
            </RouterLink>
          </div>
          <ListarEmpleados
            @eliminar="eliminarEmpleado"
            :buscar="buscar"
            :rol="rol"
            :email="email"
          />
        </section>
        <!-- Habitaciones -->
        <section v-if="section.habitaciones" class="flex-1 w-full min-w-0">
          <div class="w-full flex justify-end gap-3 items-center">
            <div class="w-full flex flex-row gap-6">
              <button
                class="mb-5 p-3 mx-auto w-full rounded-lg border-2 border-blue-700 text-blue-700 text-center hover:bg-blue-500 hover:text-white transition-colors"
                @click="setSection('reservas')"
              >
                Disponible
              </button>
              <button
                class="mb-5 p-3 mx-auto w-full rounded-lg border-2 border-blue-700 text-blue-700 text-center hover:bg-blue-500 hover:text-white transition-colors"
                @click="setSection('reservas')"
              >
                Ocupado
              </button>
            </div>
          </div>
        </section>
        <!-- Reservas-->
        <section v-if="section.reservas" class="flex-1 w-full min-w-0">
          <div class="w-full flex justify-end gap-3 items-center">
            <FormReserva :page="section.reservas" />
          </div>
        </section>
        <!-- Huesped -->
        <section v-if="section.huespedes" class="flex-1 w-full min-w-0">
          <div class="w-full flex justify-end gap-3 items-center">
            <input
              type="text"
              v-model="buscar"
              placeholder="Buscar..."
              class="py-3 px-3 w-full bg-transparent border-2 border-blue-700 text-blue-700 rounded-lg mb-5 focus:outline-none focus:text-white"
            />
            <button
              class="mb-5 p-3 max-w-60 mx-auto w-full rounded-lg border-2 border-blue-700 text-blue-700 text-center hover:bg-blue-500 hover:text-white transition-colors"
              @click="setSection('reservas')"
            >
              Iniciar Hospedaje
            </button>
          </div>
          <ListarHuesped @eliminar="eliminarEmpleado" :buscar="buscar" />
        </section>
      </div>
    </main>
  </div>
</template>

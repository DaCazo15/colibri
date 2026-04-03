<script setup>
import { onMounted, ref, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabase } from '@/composables/useSupa'

import RouterLink from '@/components/RouterLink.vue'
import useSection from '@/composables/useSection'

import HeaderComponent from '@/components/HeaderComponent.vue'
import ListarEmpleados from '@/components/empleados/ListarEmpleados.vue'
import OpcionesComponent from '@/components/OpcionesComponent.vue'
import FormReserva from '@/components/reserva/FormReserva.vue'
import ListarHuesped from '@/components/huesped/ListarHuesped.vue'
import SectionHabitaciones from '@/components/habitaciones/SectionHabitaciones.vue'
import ConfiguracionesSistema from '@/components/ConfiguracionesSistema.vue'
import CardHabitaciones from '@/components/habitaciones/CardHabitaciones.vue'
import SectionServicios from '@/components/servicios/SectionServicios.vue'
import SectionInventario from '@/components/inventario/SectionInventario.vue'

const { getTable, deleteRow } = useSupabase()
const { section, setSection } = useSection()

const router = useRouter()
const ruta = useRoute()
const sesionOn = ref(false)

const { email, rol } = ruta.query
const empleados = ref({})
const idHabitacionSelect = ref('')
const editar = ref(false)
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
const idHabitacion = (id) => {
  idHabitacionSelect.value = id
  if (!editar.value) return
  router.push({
    name: 'editar-habitacion',
    params: { id },
    query: {
      email: datos.email,
      rol: datos.rol,
      rolUser: datos.rol,
      emailUser: datos.email,
      idHabitacion: id,
    },
  })
}
const editando = () => {
  return (editar.value = !editar.value)
}
</script>

<template>
  <div v-if="ruta.query" class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <!-- header -->
    <HeaderComponent :datos="datos" @cerrarSesion="cerrarSesion" />

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
              class="py-3 px-3 w-600 bg-transparent border-2 border-blue-700 text-blue-700 rounded-lg mb-5 focus:outline-none focus:text-white"
            />
            <RouterLink
              to="agregar-empleado"
              :query="{
                email: datos.email,
                rol: datos.rol,
                rolUser: datos.rol,
                emailUser: datos.email,
              }"
            >
              Agregar
            </RouterLink>
          </div>
          <ListarEmpleados
            @eliminar="eliminarEmpleado"
            :buscar="buscar"
            :rol="rol"
            :email="email"
            :data="datos"
          />
        </section>
        <!-- Habitaciones -->
        <section v-if="section.habitaciones" class="flex-1 w-full min-w-0">
          <div class="w-full flex flex-col justify-end items-center">
            <div class="flex flex-row w-full justify-between items-center gap-5">
              <RouterLink
                v-if="['ADMIN', 'ADMINISTRADOR'].includes(datos.rol?.toUpperCase())"
                to="agregar-habitacion"
                :query="{
                  email: datos.email,
                  rol: datos.rol,
                  rolUser: datos.rol,
                  emailUser: datos.email,
                }"
              >
                Agregar Habitación
              </RouterLink>
              <button
                @click="editando"
                v-if="['ADMIN', 'ADMINISTRADOR'].includes(datos.rol?.toUpperCase())"
                class="py-3 px-4 mb-5 w-full rounded-lg border-2 border-amber-800 text-amber-800 hover:text-white transition-all duration-200 text-center hover:bg-amber-800"
                :class="{ 'bg-amber-800 text-white': editar }"
              >
                Editar Habitación
              </button>
            </div>
            <SectionHabitaciones v-if="!editar" :editar="editar" />
            <CardHabitaciones v-if="editar" @idHabitacion="idHabitacion" :editar="editar" />
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
        <!-- Servicios -->
        <section v-if="section.servicios" class="flex-1 w-full min-w-0">
          <div class="w-full flex justify-end gap-3 items-center">
            <SectionServicios />
          </div>
        </section>
        <!-- Inventario -->
        <section v-if="section.inventario" class="flex-1 w-full min-w-0">
          <div class="w-full flex justify-end gap-3 items-center">
            <SectionInventario />
          </div>
        </section>
        <!-- Opciones -->
        <section v-if="section.configuracion" class="flex-1 w-full min-w-0">
          <ConfiguracionesSistema />
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MostrarEmpleados from './MostrarEmpleados.vue'
import config from '@/helpers/config'
import { useSupabase } from '../../composables/useSupa'

const { getTable, deleteRow } = useSupabase()

const empleados = ref([])

const manejarEliminacion = async (id) => {
  const exito = await deleteRow('empleado', id)

  if (exito) {
    empleados.value = empleados.value.filter((emp) => emp.id !== id)

    emit('eliminar', id)
  } else {
    alert('Error al eliminar: El registro sigue en la base de datos.')
  }
}

const existenClientes = computed(() => {
  return empleadosOrdenados.value.length > 0
})

const emit = defineEmits(['eliminar'])
const props = defineProps({
  buscar: { type: String },
  rol: { type: String },
  email: { type: String },
  data: { type: Object, default: () => ({}) },
})

const empleadosOrdenados = computed(() => {
  let resultado = [...empleados.value]

  if (props.buscar && props.buscar.trim() !== '') {
    const busqueda = props.buscar.toLowerCase().trim()

    resultado = resultado.filter((emp) => {
      // Nota: Asegúrate que 'apellido' exista en tu DB o maneja el null
      const nombreCompleto = `${emp.nombre} ${emp.apellido || ''}`.toLowerCase()
      return nombreCompleto.includes(busqueda)
    })
  }

  return resultado.sort((a, b) => a.nombre.localeCompare(b.nombre))
})

onMounted(async () => {
  empleados.value = await getTable('empleado')
})
</script>

<template>
  <div v-if="existenClientes" class="mx-auto p-2 sm:p-5 bg-[#1f2937] shadow-xl rounded-xl">
    <div class="overflow-x-auto hide-scrollbar rounded-lg">
      <table class="min-w-full table-auto divide-y divide-gray-200">
        <thead class="">
          <tr>
            <th
              v-for="header in config.colTable"
              :key="header"
              scope="col"
              class="py-4 px-4 text-center text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white bg-[#1f2937]">
          <MostrarEmpleados
            @eliminar="manejarEliminacion"
            v-for="empleado in empleadosOrdenados"
            :key="empleado.id"
            :empleado="empleado"
            :rol="props.rol"
            :email="props.email"
            :data="props.data"
          />
        </tbody>
      </table>
    </div>
  </div>

  <p v-else class="text-gray-400 text-xl text-center py-20 font-light italic">
    No hay personal registrado actualmente...
  </p>
</template>

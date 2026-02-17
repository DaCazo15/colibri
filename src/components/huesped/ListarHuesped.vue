<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSupabase } from '../../composables/useSupa'
import MostrarHuesped from './MostraHuesped.vue'
import ModalDetalleHuesped from './ModalDetallesHuesped.vue'
import config from '@/helpers/config'

const { getTable, deleteRow } = useSupabase()

const items = ref([])
const verModal = ref(false)
const huespedSeleccionado = ref(null)

const manejarEliminacion = async (id) => {
  const exito = await deleteRow('huesped', id)
  if (exito) {
    items.value = items.value.filter((emp) => emp.id !== id)
    emit('eliminar', id)
  } else {
    alert('Error al eliminar: El registro sigue en la base de datos.')
  }
}

const abrirDetalle = (huesped) => {
  huespedSeleccionado.value = huesped
  verModal.value = true
}

const existenClientes = computed(() => itemsOrdenados.value.length > 0)

const emit = defineEmits(['eliminar'])
const props = defineProps({
  buscar: { type: String, required: true },
})

const itemsOrdenados = computed(() => {
  let resultado = [...items.value]
  if (props.buscar && props.buscar.trim() !== '') {
    const busqueda = props.buscar.toLowerCase().trim()
    resultado = resultado.filter((h) => {
      const nombreCompleto = `${h.encargado} ${h.encargado_apellido || ''}`.toLowerCase()
      return nombreCompleto.includes(busqueda)
    })
  }
  return resultado.sort((a, b) => a.encargado.localeCompare(b.encargado))
})

onMounted(async () => {
  items.value = await getTable('huesped')
})
</script>

<template>
  <div v-if="existenClientes" class="mx-auto p-2 sm:p-5 bg-[#1f2937] shadow-xl rounded-xl">
    <div class="overflow-x-auto hide-scrollbar rounded-lg">
      <table class="min-w-full table-auto divide-y divide-gray-200">
        <thead class="">
          <tr>
            <th
              v-for="header in config.colTableHuesped"
              :key="header"
              scope="col"
              class="py-4 px-4 text-center text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white bg-[#1f2937]">
          <MostrarHuesped
            @eliminar="manejarEliminacion"
            @ver-detalle="abrirDetalle"
            v-for="huesped in itemsOrdenados"
            :key="huesped.id"
            :huesped="huesped"
          />
          <ModalDetalleHuesped
            :mostrar="verModal"
            :huesped="huespedSeleccionado"
            @cerrar="verModal = false"
          />
        </tbody>
      </table>
    </div>
  </div>

  <p v-else class="text-gray-400 text-xl text-center py-20 font-light italic">
    No hay huespedes actualmente...
  </p>
</template>

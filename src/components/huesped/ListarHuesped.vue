<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSupabase } from '../../composables/useSupa'
import MostrarHuesped from './MostraHuesped.vue'
import ModalDetalleHuesped from './ModalDetallesHuesped.vue'
import config from '@/helpers/config'
import MensajeUX from '../UX/MensajeUX.vue'

const { getTable, deleteRow } = useSupabase()

const items = ref([])
const verModal = ref(false)
const huespedSeleccionado = ref(null)

// En este componente (el padre):
const conseguirID = async (huesped) => {
  const historialCompleto = await getTable('usu_historial_reserva')
  const registroHistorial = historialCompleto.find(
    (h) => h.cedula_identidad === huesped.encargado_cedula,
  )

  return {
    huespedId: huesped.id,
    historialId: registroHistorial ? registroHistorial.id : null,
  }
}

const manejarEliminacion = async (huespedObjeto) => {
  if (!confirm('¿Estás seguro de esta acción?')) return

  const ids = await conseguirID(huespedObjeto)

  try {
    const resHuesped = await deleteRow('huesped', ids.huespedId)

    let resHistorial = true
    if (ids.historialId) {
      resHistorial = await deleteRow('usu_historial_reserva', ids.historialId)
    }

    if (resHuesped && resHistorial) {
      items.value = items.value.filter((h) => h.id !== ids.huespedId)
      console.log('Eliminación exitosa de ambas tablas')
    } else {
      alert('Hubo un problema al eliminar alguno de los registros.')
    }
  } catch (error) {
    console.error('Error en el proceso de eliminación:', error)
  }
}

const abrirDetalle = (huesped) => {
  huespedSeleccionado.value = huesped
  verModal.value = true
}

const existenClientes = computed(() => itemsOrdenados.value.length > 0)

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
  <MensajeUX v-else mensaje="No hay huespedes actualmente..." />
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useSupabase } from '@/composables/useSupa'

const props = defineProps({
  data: Object,
  itemsFiltrados: Object,
  mensaje: String,
  estatus: String,
})

const { getSelectRow } = useSupabase()
const habitacion = ref({})

onMounted(async () => {
  const data = await getSelectRow('habitaciones', 'id', props.data.habitacion)
  if (data) {
    habitacion.value = data
  }
  console.log(habitacion.value)
})

const detalles = computed(() => {
  if (!habitacion.value || !habitacion.value.estatus) return false

  if (habitacion.value.estatus !== 'Disponible') {
    return true
  }

  return !!(props.data.fecha && props.data.habitacion && props.itemsFiltrados)
})
</script>

<template>
  <div class="flex flex-col w-full items-center">
    <div
      v-if="detalles"
      class="bg-gray-800 p-6 rounded-2xl text-white w-full shadow-2xl border border-gray-700"
    >
      <!--  -->
      <!--  -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-blue-400 font-bold uppercase text-sm tracking-widest">
          Detalles de Reserva #{{ props.itemsFiltrados.id }}
        </h3>
        <span class="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold">
          {{ props.itemsFiltrados.reserva?.temporada ? 'Temporada Alta' : 'Temporada Regular' }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
          <p class="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
            Información del Huésped
          </p>
          <div class="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
            <p class="text-lg font-semibold text-white">{{ props.itemsFiltrados.name_huesped }}</p>
            <p class="text-sm text-gray-400">CI: {{ props.itemsFiltrados.cedula_identidad }}</p>
            <p class="text-sm text-gray-400">
              Tel: {{ props.itemsFiltrados.reserva?.encargado_telefono }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Estancia</p>
          <div class="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
            <p class="text-white">
              Habitación:
              <span class="text-blue-400 font-bold">{{ props.itemsFiltrados.habitacion }}</span>
            </p>
            <div class="grid grid-cols-2 gap-2 mt-1 text-xs">
              <div>
                <p class="text-gray-500 italic">Check-In</p>
                <p>{{ props.itemsFiltrados.reserva?.fecha_entrada }}</p>
              </div>
              <div>
                <p class="text-gray-500 italic">Check-Out</p>
                <p>{{ props.itemsFiltrados.reserva?.fecha_salida }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="md:col-span-2 space-y-2">
          <p class="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
            Acompañantes ({{ props.itemsFiltrados.reserva?.demas?.length || 0 }})
          </p>
          <div class="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
            <div
              v-if="props.itemsFiltrados.reserva?.demas?.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              <div
                v-for="(persona, index) in props.itemsFiltrados.reserva.demas"
                :key="index"
                class="text-sm bg-gray-800 p-2 rounded border border-gray-600"
              >
                {{ persona.nombre }} {{ persona.apellido }}
                <span class="text-gray-500 text-xs">({{ persona.cedula }})</span>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500 italic">Sin acompañantes registrados.</p>
          </div>
        </div>

        <div class="md:col-span-2 space-y-2">
          <p class="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
            Pagos y Facturación
          </p>
          <div
            class="flex flex-wrap gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700 justify-between"
          >
            <div>
              <p class="text-xs text-gray-500">Método de Pago</p>
              <p class="font-bold text-green-400">
                {{ props.itemsFiltrados.reserva?.metodode_pago }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Fecha de Facturación</p>
              <p class="font-bold">
                {{ props.itemsFiltrados.reserva?.facturacion || 'Pendiente' }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Multas/Extras</p>
              <p :class="props.itemsFiltrados.multa?.length > 0 ? 'text-red-400' : 'text-gray-400'">
                {{ props.itemsFiltrados.multa?.length > 0 ? 'Cargos pendientes' : 'Sin cargos' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <div
      v-else
      class="w-full flex flex-col items-center justify-center p-20 bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-700"
    >
      <p class="text-gray-500 font-medium">
        {{ `Seleccione una ${props.mensaje} para ver los detalles.` }}
      </p>
    </div>
    <!--  -->
    <!--  -->
  </div>
</template>

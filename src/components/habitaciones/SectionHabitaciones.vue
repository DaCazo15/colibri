<script setup>
import { onMounted, watch, reactive, ref, computed } from 'vue'
import { useSupabase } from '@/composables/useSupa'
import CardHabitaciones from './CardHabitaciones.vue'

const { getTable } = useSupabase()
const habitaciones = ref([])
const items = ref([])
const itemsFiltrados = ref({})
const habitacionesFiltradas = ref([])

const data = reactive({
  fecha: '',
  habitacion: '',
})

const mensaje = computed(() => {
  return data.fecha ? 'habitación con reserva' : 'fecha'
})

watch(
  () => [data.fecha, data.habitacion],
  ([nuevaFecha, nuevaHabitacion]) => {
    if (nuevaFecha || nuevaHabitacion) {
      filtrado(nuevaFecha, nuevaHabitacion)
    }
  },
)

onMounted(async () => {
  const [resItems, resHab] = await Promise.all([
    getTable('usu_historial_reserva'),
    getTable('habitaciones'),
  ])
  console.log(resItems)

  if (resItems) items.value = resItems
  if (resHab) {
    habitaciones.value = resHab.sort(
      (a, b) => parseInt(a.numero_habitacion) - parseInt(b.numero_habitacion),
    )
  }
})

const selectHabitacion = (value) => {
  data.habitacion = value
  console.log(data.habitacion)
}
const filtrado = (fecha = null, habitacion = null) => {
  habitacionesFiltradas.value = items.value.filter((item) => {
    return item.fecha_reserva === fecha
  })
  if (!fecha || !habitacion) {
    itemsFiltrados.value = null
    return
  }

  itemsFiltrados.value =
    items.value.find((item) => item.fecha_reserva === fecha && item.habitacion === habitacion) ??
    null
}
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full gap-5">
    <div class="flex flex-row justify-between items-center w-full p-5 rounded-xl bg-gray-800">
      <p class="text-xl text-white font-semibold">Selecciona una fecha:</p>
      <input
        type="date"
        v-model="data.fecha"
        class="py-2 px-4 text-2xl font-semibold bg-gray-200 rounded-xl uppercase"
      />
    </div>
    <div class="flex flex-row justify-baseline w-full gap-5">
      <CardHabitaciones
        v-if="data.fecha"
        @selectHabitacion="selectHabitacion"
        :habitacionesFiltradas="habitacionesFiltradas"
      />
      <div class="flex flex-col w-full items-center">
        <div
          v-if="data.fecha && data.habitacion && itemsFiltrados"
          class="bg-gray-800 p-6 rounded-2xl text-white w-full shadow-2xl border border-gray-700"
        >
          <!--  -->
          <!--  -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-blue-400 font-black uppercase text-sm tracking-widest">
              Detalles de Reserva #{{ itemsFiltrados.id }}
            </h3>
            <span class="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold">
              {{ itemsFiltrados.reserva?.temporada ? 'Temporada Alta' : 'Temporada Regular' }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <p class="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
                Información del Huésped
              </p>
              <div class="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <p class="text-lg font-semibold text-white">{{ itemsFiltrados.name_huesped }}</p>
                <p class="text-sm text-gray-400">CI: {{ itemsFiltrados.cedula_identidad }}</p>
                <p class="text-sm text-gray-400">
                  Tel: {{ itemsFiltrados.reserva?.encargado_telefono }}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <p class="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Estancia</p>
              <div class="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <p class="text-white">
                  Habitación:
                  <span class="text-blue-400 font-bold">{{ itemsFiltrados.habitacion }}</span>
                </p>
                <div class="grid grid-cols-2 gap-2 mt-1 text-xs">
                  <div>
                    <p class="text-gray-500 italic">Check-In</p>
                    <p>{{ itemsFiltrados.reserva?.fecha_entrada }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 italic">Check-Out</p>
                    <p>{{ itemsFiltrados.reserva?.fecha_salida }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="md:col-span-2 space-y-2">
              <p class="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
                Acompañantes ({{ itemsFiltrados.reserva?.demas?.length || 0 }})
              </p>
              <div class="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <div
                  v-if="itemsFiltrados.reserva?.demas?.length > 0"
                  class="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  <div
                    v-for="(persona, index) in itemsFiltrados.reserva.demas"
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
                    {{ itemsFiltrados.reserva?.metodode_pago }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Fecha de Facturación</p>
                  <p class="font-bold">{{ itemsFiltrados.reserva?.facturacion || 'Pendiente' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Multas/Extras</p>
                  <p :class="itemsFiltrados.multa?.length > 0 ? 'text-red-400' : 'text-gray-400'">
                    {{ itemsFiltrados.multa?.length > 0 ? 'Cargos pendientes' : 'Sin cargos' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="w-full flex flex-col items-center justify-center p-20 bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-700"
        >
          <p class="text-gray-500 font-medium">
            {{ `Seleccione una ${mensaje} para ver los detalles.` }}
          </p>
        </div>
        <!--  -->
        <!--  -->
      </div>
    </div>
  </div>
</template>

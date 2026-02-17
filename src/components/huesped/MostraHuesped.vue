<script setup>
const props = defineProps({
  huesped: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['eliminar', 'ver-detalle'])
const nombre = props.huesped.encargado + ' ' + props.huesped.encargado_apellido
const telefono =
  props.huesped.encargado_telefono.slice(0, 3) + ' ' + props.huesped.encargado_telefono.slice(3)

const seleccionarHuesped = (e) => {
  if (e.target.tagName !== 'BUTTON') {
    emit('ver-detalle', props.huesped)
  }
}
</script>

<template>
  <tr
    @click="seleccionarHuesped"
    class="hover:bg-gray-900 cursor-pointer transition-colors border-b border-gray-700/50"
  >
    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
      <p class="font-medium text-gray-50">{{ nombre }}</p>
      <p class="font-medium text-gray-50/50">{{ props.huesped.email }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-50">
      <p>{{ props.huesped.encargado_cedula }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ telefono }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ props.huesped.fecha_entrada }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ props.huesped.fecha_salida }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ props.huesped.habitacion }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ props.huesped.cantidad_personas }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ props.huesped.metodode_pago }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ props.huesped.facturacion }}</p>
    </td>

    <td
      class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center flex flex-row gap-3 justify-center items-center h-auto"
    >
      <button
        class="text-red-500 hover:text-red-400 font-bold uppercase text-[10px] tracking-widest"
        @click.stop="emit('eliminar', props.huesped.id)"
      >
        Eliminar
      </button>
    </td>
  </tr>
</template>

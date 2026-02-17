<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  empleado: { type: Object },
  rol: { type: String },
  email: { type: String },
  data: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['eliminar'])
const nombre = props.empleado.nombre + ' ' + props.empleado.apellido
const telefono = props.empleado.telefono.slice(0, 3) + ' ' + props.empleado.telefono.slice(3)
</script>

<template>
  <tr>
    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
      <p class="font-medium text-gray-50">{{ nombre }}</p>
      <p class="font-medium text-gray-50/50">{{ props.empleado.email }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
      <p
        class="text-gray-900 font-bold"
        :class="{
          'bg-red-800 text-white rounded-3xl p-1 font-normal':
            props.empleado.rol === 'Administrador',
          'bg-gray-900 text-white rounded-3xl p-1 font-normal': props.empleado.rol === 'Supervisor',
          'bg-orange-800 text-white rounded-3xl p-1 font-normal':
            props.empleado.rol === 'Recepcionista',
          'bg-indigo-800 text-white rounded-3xl p-1 font-normal': props.empleado.rol === 'Empleado',
          'bg-green-800 text-white rounded-3xl p-1 font-normal': props.empleado.rol === 'Admin',
        }"
      >
        {{ props.empleado.rol }}
      </p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-50">
      <p>{{ props.empleado.cedula }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ props.empleado.fechaNacimiento }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ telefono }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ props.empleado.direccion }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>$ {{ props.empleado.salario }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ props.empleado.turno }}</p>
    </td>
    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center">
      <p>{{ props.empleado.area }}</p>
    </td>
    <td
      class="whitespace-nowrap px-3 py-4 text-sm text-gray-50 text-center flex flex-row gap-3 justify-center items-center h-auto"
    >
      <RouterLink
        :to="{
          name: 'editar-empleado',
          params: { id: props.empleado.id },
          query: { email: props.email, rol: props.rol },
          state: { email: props.data.email, rol: props.data.rol },
        }"
        class="cursor-pointer text-green-600 hover:text-green-700 transition-colors font-normal"
        >Editar</RouterLink
      >
      <button
        class="text-red-600 hover:text-red-700 transition-colors font-normal"
        @click="emit('eliminar', props.empleado.id)"
      >
        Eliminar
      </button>
    </td>
  </tr>
</template>

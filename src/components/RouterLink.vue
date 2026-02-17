<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  to: {
    type: String,
    required: true,
  },
  // Añadimos un prop para los parámetros de búsqueda
  query: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <RouterLink
    :to="{
      name: to,
      query: query,
      state: { email: query.emailUser, rol: query.rolUser },
    }"
  >
    <div
      class="mb-5 p-3 max-w-60 mx-auto w-full rounded-lg border-2 border-blue-700 text-blue-700 text-center hover:bg-blue-500 hover:text-white transition-colors"
    >
      <slot></slot>
    </div>
  </RouterLink>
</template>

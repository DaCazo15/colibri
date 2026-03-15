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
    class="mb-5 p-3 w-full rounded-lg border-2 border-blue-700 text-blue-700 text-center hover:bg-blue-500 hover:text-white transition-colors"
    :to="{
      name: to,
      query: query,
      state: { email: query.emailUser, rol: query.rolUser },
    }"
  >
    <div>
      <slot></slot>
    </div>
  </RouterLink>
</template>

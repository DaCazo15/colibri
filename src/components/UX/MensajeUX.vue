<script setup>
defineProps({
  mensaje: { type: String, required: true },
})
</script>

<template>
  <div
    class="w-full flex flex-col items-center justify-center p-20 bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-700"
  >
    <p class="text-gray-500 text-xl text-center font-light italic">
      {{ mensaje }}
    </p>
  </div>
</template>

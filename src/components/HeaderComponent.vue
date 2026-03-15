<script setup>
const props = defineProps({
  datos: { type: Object, required: true },
})
const emit = defineEmits(['cerrarSesion'])
</script>

<template>
  <header class="bg-[#1f2937] shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 w-full">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center gap-3">
          <!-- logo placeholder -->
          <div class="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm">
            <span class="text-white font-bold text-lg">C</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-50 tracking-tight">Colibri</h1>
        </div>
        <!-- opciones usuario -->
        <div class="flex items-center gap-4">
          <div class="hidden md:flex flex-col items-end">
            <span class="text-sm font-semibold text-gray-200">{{ props.datos.rol }}</span>
            <span class="text-xs text-gray-50">{{ props.datos.email }}</span>
          </div>
          <div class="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
          <button class="p-2 cursor-pointer" @click="emit('cerrarSesion')">
            <img
              src="../assets/icons/salir.png"
              alt="opciones"
              class="w-6 h-6 invert hover:invert-50 transition-colors"
            />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

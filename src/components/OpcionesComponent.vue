<script setup>
import config from '@/helpers/config'

const props = defineProps({
  section: { type: Object, required: true },
  rol: { type: String, required: true, default: '' },
})

// Corregido a formato Array
const emit = defineEmits(['setSection'])
</script>

<template>
  <div v-if="props.rol" class="bg-[#1f2937] rounded-lg py-5 px-7 gap-10 flex flex-col shadow">
    <div class="bg-blue-500 h-2 -mb-2 mt-2 rounded-full opacity-80"></div>

    <div
      v-for="opcion in config.secciones(props.rol.toLowerCase())"
      :key="opcion.id"
      @click="emit('setSection', opcion.nombre.toLowerCase())"
      class="mt-2 px-3 py-5 flex items-center gap-5 w-full rounded-lg cursor-pointer transition-all duration-200 group"
      :class="[
        section[opcion.nombre.toLowerCase()] ? 'bg-gray-300 shadow-inner' : 'hover:bg-gray-700',
      ]"
    >
      <div class="flex flex-row items-center gap-3">
        <img
          :src="opcion.icono"
          :alt="opcion.nombre"
          class="w-8 transition-transform group-hover:scale-110"
          :class="props.section[opcion.nombre.toLowerCase()] ? 'invert-0' : 'invert'"
        />
        <b
          class="text-xl transition-colors"
          :class="props.section[opcion.nombre.toLowerCase()] ? 'text-gray-900' : 'text-white'"
        >
          {{ opcion.nombre }}
        </b>
      </div>
    </div>
  </div>

  <div v-else class="text-gray-500 animate-pulse p-10 text-center bg-[#1f2937] rounded-lg">
    Validando permisos...
  </div>
</template>

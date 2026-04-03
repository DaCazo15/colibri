<script setup>
import config from '@/helpers/config'
</script>

<template>
  <div class="p-10 w-full flex items-center">
    <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-5">
      <div class="space-y-2">
        <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
          >Nombre de la Bebida</label
        >
        <input type="text" placeholder="Servicio" :class="config.inputClass" />
      </div>
      <div class="space-y-2">
        <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
          >Tipo de Bebida</label
        >
        <select :class="config.inputClass">
          <option value="">-- Seleccione --</option>
          <option>Alcoholica</option>
          <option>Sin Alcohol</option>
        </select>
      </div>
      <div class="space-y-2">
        <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest">Precio</label>
        <input type="number" placeholder="0" :class="config.inputClass" />
      </div>
      <div class="md:col-span-2 pt-4">
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-gray-50 font-black py-4 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] uppercase tracking-tighter text-lg"
        >
          Añadir Bebida
        </button>
      </div>
    </form>
  </div>
</template>

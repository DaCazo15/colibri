<script setup>
import config from '@/helpers/config'
import objetos from '@/helpers/objetos'
</script>

<template>
  <div class="p-10 w-full flex items-center">
    <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-5">
      <div class="space-y-2">
        <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
          >Nombre del Item</label
        >
        <input type="text" placeholder="Servicio" :class="config.inputClass" />
      </div>
      <div class="space-y-2">
        <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
          >Sección del Item</label
        >
        <select :class="config.inputClass">
          <option>-- Seleccione --</option>
          <option v-for="value in objetos.items_Inventario" :key="value.id" :value="value.value">
            {{ value.label }}
          </option>
        </select>
      </div>
      <div class="space-y-2">
        <label class="block text-xs font-bold text-gray-50 uppercase tracking-widest"
          >Cantidad</label
        >
        <input type="number" placeholder="0" :class="config.inputClass" />
      </div>
      <div class="md:col-span-2 pt-4">
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-gray-50 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] uppercase tracking-tighter text-lg"
        >
          Añadir Item
        </button>
      </div>
    </form>
  </div>
</template>

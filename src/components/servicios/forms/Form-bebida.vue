<script setup>
import config from '@/helpers/config'
import objetos from '@/helpers/objetos'
import { ref } from 'vue'

const ingredientes = ref([''])

const agregarIngrediente = () => {
  ingredientes.value.push('')
}

const eliminarIngrediente = (index) => {
  ingredientes.value.splice(index, 1)
}

const handleSubmit = () => {
  objetos.data_receta.receta = ingredientes.value
}
</script>

<template>
  <div class="w-full p-8 rounded-2xl bg-gray-800 flex items-center">
    <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-7">
      <div class="space-y-2">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest"
          >Nombre de la Bebida</label
        >
        <input
          type="text"
          v-model="objetos.data_receta.nombre"
          placeholder="Nombre de la Bebida"
          :class="config.inputClass"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest"
          >Tipo de Bebida</label
        >
        <select :class="config.inputClass" v-model="objetos.data_receta.tipo">
          <option value="">-- Seleccione --</option>
          <option value="alcoholica">Alcoholica</option>
          <option value="sin_alcohol">Sin Alcohol</option>
        </select>
      </div>

      <div class="space-y-2">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest"
          >Receta</label
        >

        <div class="flex flex-col gap-3">
          <div
            v-for="(ingrediente, index) in ingredientes"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="ingredientes[index]"
              type="text"
              :placeholder="`Ingrdiente ${index + 1}`"
              :class="config.inputClass"
              class="flex-1"
            />

            <button
              v-if="ingredientes.length > 1"
              type="button"
              @click="eliminarIngrediente(index)"
              class="py-2 px-3 font-bold text-slate-200 text-2xl bg-red-700/50 hover:bg-red-700 transition-all duration-300 ease-in-out rounded-xl"
            >
              -
            </button>

            <button
              v-if="index === ingredientes.length - 1"
              type="button"
              @click="agregarIngrediente"
              class="p-2 font-bold text-slate-200 text-2xl bg-blue-700/50 hover:bg-blue-700 transition-all duration-300 ease-in-out rounded-xl"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest"
          >Indicaciones</label
        >
        <input
          type="text"
          v-model="objetos.data_receta.indicaciones"
          placeholder="Indicaciones de la Bebida..."
          :class="config.inputClass"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest"
          >Precio</label
        >
        <input
          type="number"
          v-model="objetos.data_receta.precio"
          placeholder="0"
          :class="config.inputClass"
        />
      </div>

      <div class="md:col-span-2 pt-4">
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-gray-50 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg active:scale-[0.98] uppercase tracking-tighter text-lg"
        >
          Añadir Bebida
        </button>
      </div>
    </form>
  </div>
</template>

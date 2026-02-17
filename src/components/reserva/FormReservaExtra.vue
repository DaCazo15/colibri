<script setup>
const model = defineModel()

const props = defineProps({
  labelClass: String,
  inputClass: String,
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="flex flex-col">
      <label :class="props.labelClass">Nombre</label>
      <input type="text" :class="props.inputClass" placeholder="Nombre" v-model="model.nombre" />
    </div>

    <div class="flex flex-col">
      <label :class="props.labelClass">Apellido</label>
      <input
        type="text"
        :class="props.inputClass"
        placeholder="Apellido"
        v-model="model.apellido"
      />
    </div>

    <div class="flex flex-col">
      <label :class="props.labelClass">Cédula</label>
      <input type="text" :class="props.inputClass" placeholder="Cédula" v-model="model.cedula" />
    </div>

    <div class="flex flex-col">
      <label :class="props.labelClass">Teléfono (Opcional)</label>
      <input
        type="text"
        :class="props.inputClass"
        placeholder="Teléfono"
        v-model="model.telefono"
      />
    </div>
  </div>
</template>

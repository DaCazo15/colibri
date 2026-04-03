<script setup>
import config from '@/helpers/config'
import { reactive, computed } from 'vue'

import FormBebida from './forms/Form-bebida.vue'
import FormComida from './forms/Form-comida.vue'
import MensajeUX from '../UX/MensajeUX.vue'

const vistaON = reactive({
  barra: false,
  restaurante: false,
})

const mensaje = computed(() => !vistaON.barra && !vistaON.restaurante)
const boton = (x) => config.buttonClass[vistaON[x] ? 'cerrar' : 'activo']
const idBoton = (x) => (vistaON[x] ? 'cerrar' : x)

const cambioVista = (e) => {
  if (e.target.id === 'barra') {
    vistaON.barra = true
    vistaON.restaurante = false
  }
  if (e.target.id === 'restaurante') {
    vistaON.barra = false
    vistaON.restaurante = true
  }
  if (e.target.id === 'cerrar') {
    vistaON.barra = false
    vistaON.restaurante = false
  }
}
</script>

<template>
  <div class="flex w-full flex-col justify-center items-center gap-5">
    <!-- Botones  -->
    <div class="flex gap-5 w-full justify-between items-center">
      <button :class="`capitalize ${boton('barra')}`" @click="cambioVista" :id="idBoton('barra')">
        {{ idBoton('barra') }}
      </button>
      <button
        :class="`capitalize ${boton('restaurante')}`"
        @click="cambioVista"
        :id="idBoton('restaurante')"
      >
        {{ idBoton('restaurante') }}
      </button>
    </div>

    <FormBebida v-if="vistaON.barra" />
    <FormComida v-if="vistaON.restaurante" />

    <MensajeUX v-if="mensaje" mensaje="Selecciona una Seccion y ve sus Items..." />
  </div>
</template>

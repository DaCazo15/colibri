<script setup>
defineProps(['huesped', 'mostrar'])
defineEmits(['cerrar'])
</script>

<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
  >
    <div
      class="bg-[#1f2937] border border-gray-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300"
    >
      <div class="p-6 border-b border-gray-700 flex justify-between items-center bg-[#111827]">
        <div>
          <h3 class="text-xl font-bold text-white tracking-tight">Detalle de Hospedaje</h3>
          <p class="text-xs text-blue-400 font-bold uppercase tracking-widest">
            ID: {{ huesped.id }}
          </p>
        </div>
        <button @click="$emit('cerrar')" class="text-gray-400 hover:text-white text-2xl">
          &times;
        </button>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
        <div
          v-for="(val, label) in {
            Encargado: huesped.encargado + ' ' + huesped.encargado_apellido,
            Documento: huesped.encargado_cedula,
            Contacto: huesped.encargado_telefono,
            Entrada: huesped.fecha_entrada,
            Salida: huesped.fecha_salida,
            Habitación: huesped.habitacion,
            Huéspedes: huesped.cantidad_personas,
            Pago: huesped.metodode_pago,
            Facturación: huesped.facturacion,
          }"
          :key="label"
        >
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
            {{ label }}
          </p>
          <p class="text-gray-100 font-medium border-l-2 border-blue-600 pl-3 bg-blue-600/5 py-1">
            {{ val }}
          </p>
        </div>
      </div>

      <div class="p-4 bg-[#111827] flex justify-end">
        <button
          @click="$emit('cerrar')"
          class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all text-sm"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

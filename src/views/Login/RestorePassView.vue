<script setup>
import { ref } from 'vue'

const email = ref('')
const isSubmitted = ref(false)

const handleReset = () => {
  console.log('Enviando enlace de recuperación a:', email.value)
  // Aquí dispararías la lógica para tu backend en Python
  isSubmitted.value = true
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div
      class="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl border border-gray-700 text-center"
    >
      <div
        class="mx-auto h-12 w-12 text-blue-500 bg-blue-500/10 rounded-full flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      </div>

      <div v-if="!isSubmitted">
        <h2 class="mt-4 text-3xl font-extrabold text-white">¿Olvidaste tu contraseña?</h2>
        <p class="mt-2 text-sm text-gray-400">
          No te preocupes. Introduce tu correo y te enviaremos un enlace para restablecerla.
        </p>

        <form class="mt-8 space-y-6" @submit.prevent="handleReset">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-300 text-left"
              >Correo electrónico</label
            >
            <input
              v-model="email"
              id="email-address"
              type="email"
              required
              class="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              placeholder="admin@colibri.com"
            />
          </div>

          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
          >
            Enviar enlace
          </button>
        </form>
      </div>

      <div v-else class="space-y-6 animate-fade-in">
        <h2 class="text-2xl font-bold text-white font-serif">¡Revisa tu correo!</h2>
        <p class="text-gray-400">
          Hemos enviado instrucciones a <span class="text-white font-medium">{{ email }}</span
          >.
        </p>
        <button
          @click="isSubmitted = false"
          class="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          ¿No recibiste nada? Reintentar
        </button>
      </div>

      <div class="mt-6 border-t border-gray-700 pt-6">
        <router-link
          :to="{ name: 'login' }"
          class="text-sm font-medium text-gray-400 hover:text-white flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al inicio de sesión
        </router-link>
        <p class="text-center text-xs text-gray-500">&copy; 2026 Gestion Colibri.</p>
      </div>
    </div>
  </div>
</template>

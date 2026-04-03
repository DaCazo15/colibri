<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useSupabase } from '@/composables/useSupa'
import { useToken } from '@/composables/useToken'

const email = ref('')
const password = ref('')
const user = ref('')
const users = ref({})
const cambioRuta = useRouter()
const error = ref('')

const { existeItemEnTabla, getRolByEmail, getSelectTable } = useSupabase()
const { inspector, generarHash } = useToken()

const handleLogin = async () => {
  let data = {
    email: email.value,
    password: password.value,
    user: user.value,
  }
  if (Object.values(data).includes('')) return
  try {
    existeItemEnTabla('usuario', 'email', email.value).then(async () => {
      users.value = await getSelectTable('usuario', email.value)
      let rol = await getRolByEmail('usuario', email.value)
      if (users.value) {
        const ok = await inspector(data, users.value)
        if (ok) {
          error.value = false
          cambioRuta.push({
            name: 'center-panel',
            replace: true,
            query: {
              email: `${(await generarHash(email.value)).slice(0, (Math.random() * 10).toFixed())}-private[${email.value.slice(0, 1)}]`,
              rol: `${(await generarHash(rol)).slice(0, (Math.random() * 10).toFixed())}-private[${rol.slice(0, 1).toLowerCase()}]`,
            },
            params: { user: rol.toLowerCase() },
            state: {
              email: email.value,
              rol: rol,
            },
          })
        } else {
          setTimeout(() => {
            error.value = true
          }, 1000)
          error.value = false
        }
      }
    })
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div
      class="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl border border-gray-700"
    >
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-white">
          Login <span class="text-blue-500">Colibri</span>
        </h2>
        <p class="mt-2 text-sm text-gray-400">Ingresa tus credenciales para continuar</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-300"
              >Correo electrónico</label
            >
            <input
              v-model="email"
              id="email-address"
              name="email"
              type="email"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              placeholder="Ej: admin@colibri.com"
            />
          </div>
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-300"
              >Usuario</label
            >
            <input
              v-model="user"
              name="user"
              type="text"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              placeholder="Ej: usuario123"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300">Contraseña</label>
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          <div class="flex items-center text-xl text-red-600" v-if="error">
            Las credenciales son incorrectas.
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-200"
          >
            Iniciar Sesión
          </button>
        </div>

        <div class="flex items-center justify-center text-sm">
          <RouterLink
            :to="{ name: 'forgot-password' }"
            class="font-medium text-blue-400 hover:text-blue-300"
            >¿Olvidaste tu contraseña?</RouterLink
          >
        </div>
      </form>

      <p class="text-center text-xs text-gray-500">&copy; 2026 Gestion Colibri.</p>
    </div>
  </div>
</template>

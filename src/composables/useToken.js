import { ref, reactive, computed } from 'vue'
// import bcrypt from 'bcryptjs'

export function useToken() {
  const token = ref(null)
  const users = ref([])
  const userLogin = reactive({
    password: '',
    user: '',
    email: '',
  })

  const generateToken = () => {
    return Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const generarHash = async (palabra) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(palabra)

    const hashBuffer = await crypto.subtle.digest('SHA-256', data)

    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    return String(hashHex)
  }

  // const comparePassword = (password, hash) => {
  //   return bcrypt.compareSync(password, hash)
  // }

  const verificador = computed(() => {
    return users.value.find((user) => {
      return (
        user.usuario === userLogin.user &&
        user.clave === userLogin.password &&
        user.email === userLogin.email
      )
    })
  })

  const logout = () => {
    userLogin.usuario = ''
    userLogin.clave = ''
    userLogin.email = ''
    removeToken()
  }

  const setToken = (value) => {
    localStorage.setItem('token', value)
  }

  const getToken = () => {
    token.value = localStorage.getItem('token')
  }

  const removeToken = () => {
    token.value = null
    localStorage.removeItem('token')
  }

  const inspector = (v1, v2) => {
    Object.assign(userLogin, v1)
    users.value = v2
    if (verificador.value) {
      token.value = generateToken()
    } else {
      token.value = null
    }
    setToken(token.value)
    return token.value ? true : false
  }

  return {
    inspector,
    getToken,
    logout,
    generarHash,
  }
}

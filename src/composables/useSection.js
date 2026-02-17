import { reactive, onMounted, watch } from 'vue'

export default function useSection() {
  const section = reactive({
    personal: true,
    habitaciones: false,
    reservas: false,
    huespedes: false,
    servicios: false,
    inventario: false,
    reportes: false,
    configuracion: false,
  })

  watch(
    section,
    (newSection) => {
      const active = Object.keys(newSection).find((key) => newSection[key])
      localStorage.setItem('section', active)
    },
    { deep: true },
  )

  onMounted(() => {
    const savedSection = localStorage.getItem('section')
    if (savedSection && savedSection in section) {
      setSection(savedSection)
    }
  })

  const setSection = (sectionName) => {
    Object.keys(section).forEach((key) => {
      section[key] = false
    })
    section[sectionName] = true
  }

  return { section, setSection }
}

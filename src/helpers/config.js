const opciones = {
  promocion: {
    id: 0,
    icono: new URL('../assets/icons/cupon.png', import.meta.url).href,
    nombre: 'Promociones',
  },
  personal: {
    id: 1,
    icono: new URL('../assets/icons/empleado.png', import.meta.url).href,
    nombre: 'Personal',
  },
  habitaciones: {
    id: 2,
    icono: new URL('../assets/icons/habitacion.png', import.meta.url).href,
    nombre: 'Habitaciones',
  },
  reservas: {
    id: 3,
    icono: new URL('../assets/icons/recepcion.png', import.meta.url).href,
    nombre: 'Reservas',
  },
  huesped: {
    id: 4,
    icono: new URL('../assets/icons/huesped.png', import.meta.url).href,
    nombre: 'Huespedes',
  },
  servicios: {
    id: 5,
    icono: new URL('../assets/icons/bar.png', import.meta.url).href,
    nombre: 'Servicios',
  },
  inventario: {
    id: 6,
    icono: new URL('../assets/icons/inventario.png', import.meta.url).href,
    nombre: 'Inventario',
  },
  reportes: {
    id: 7,
    icono: new URL('../assets/icons/reporte.png', import.meta.url).href,
    nombre: 'Reportes',
  },
  configuracion: {
    id: 8,
    icono: new URL('../assets/icons/config.png', import.meta.url).href,
    nombre: 'Configuracion',
  },
}

const colTable = [
  'Nombre',
  'Rol',
  'Cédula',
  'Fecha de Nacimiento',
  'Contacto',
  'Dirección',
  'Salario',
  'Turno',
  'Área',
]

const colTableHuesped = [
  'Encargado',
  'Cédula',
  'Contacto',
  'Fecha de Entrada',
  'Fecha de Salida',
  'Número de Habitación',
  'Número de Personas',
  'Metodo de Pago',
  'Facturacion',
]

const inputClass =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700 bg-gray-100'

const turnos = ['Mañana', 'Tarde', 'Noche']
const roles = ['Supervisor', 'Administrador', 'Recepcionista', 'Empleado']
const seccionesUserEvitadas = {
  recepcionista: ['Personal', 'Reportes', 'Inventario'],
  empleado: ['Personal', 'Habitaciones', 'Reservas', 'Reportes', 'Inventario'],
}

const secciones = (rol) => {
  const todasLasOpciones = Object.values(opciones)

  if (seccionesUserEvitadas[rol]) {
    return todasLasOpciones.filter((op) => !seccionesUserEvitadas[rol].includes(op.nombre))
  }
  return todasLasOpciones
}
const rolesPermitidos = (rol) => {
  if (rol === 'administrador') {
    return ['Supervisor', 'Administrador', 'Recepcionista', 'Empleado']
  }
  if (rol === 'supervisor') {
    return ['Administrador', 'Recepcionista', 'Empleado']
  }
  return ['Supervisor', 'Administrador', 'Recepcionista', 'Empleado']
}

export default {
  opciones,
  secciones,
  rolesPermitidos,
  colTable,
  colTableHuesped,
  inputClass,
  turnos,
  roles,
}

import { reactive } from 'vue'

const reserva = reactive({
  encargado: '',
  encargado_apellido: '',
  encargado_cedula: '',
  encargado_telefono: '',
  check_in: '3:00:00 PM',
  check_out: '12:00:00 PM',
  habitacion: '',
  fecha_reserva: '',
  fecha_entrada: '',
  fecha_salida: '',
  cantidad_personas: 1,
  metodode_pago: 'Transferencia',
  facturacion: '',
  demas: [],
})

const items_Inventario = reactive([
  { id: 1, value: 'Viveres', label: 'Viveres' },
  { id: 2, value: 'Bebidas', label: 'Bebidas' },
  { id: 3, value: 'Alimentos', label: 'Alimentos' },
  { id: 4, value: 'Utencilios', label: 'Utencilios' },
  { id: 5, value: 'Habitacion', label: 'Habitacion' },
  { id: 6, value: 'Piscina', label: 'Piscina' },
  { id: 7, value: 'Otros', label: 'Otros' },
])

const data_receta = reactive({
  nombre: '',
  tipo: '',
  receta: [],
  indicaciones: '',
  precio: 0,
})

const usu_historial_reserva = reactive({
  name_huesped: '',
  reserva: [],
  servicio: [],
  inventario_habitacion: [],
  multa: [],
  temporada: '',
  facturacion: [],
})

export default {
  reserva,
  usu_historial_reserva,
  items_Inventario,
  data_receta,
}

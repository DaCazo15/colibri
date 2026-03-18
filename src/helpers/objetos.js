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
}

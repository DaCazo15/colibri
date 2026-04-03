import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Login/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      props: {
        page: 'login',
      },
      component: Index,
    },
    {
      path: '/forgot-pass',
      name: 'forgot-password',
      props: {
        page: 'Restore Password',
      },
      component: () => import('../views/Login/RestorePassView.vue'),
    },
    {
      path: '/center-panel:user?',
      name: 'center-panel',
      props: {
        page: 'Panel Central',
      },
      component: () => import('../views/PanelCentralView.vue'),
    },
    {
      path: '/agregar-empleado',
      name: 'agregar-empleado',
      props: {
        page: 'Registro de Personal',
      },
      component: () => import('../views/form-empleado/FormularioEmpleadoView.vue'),
    },
    {
      path: '/editar-empleado/:id',
      name: 'editar-empleado',
      props: {
        page: 'Editar Personal',
      },
      component: () => import('../views/form-empleado/EditarEmpleadoView.vue'),
    },
    {
      path: '/agregar-habitacion',
      name: 'agregar-habitacion',
      props: {
        page: 'Registro de Habitaciones',
      },
      component: () => import('../views/form-habitaciones/AgregarHabitacionView.vue'),
    },
    {
      path: '/editar-habitacion/:id',
      name: 'editar-habitacion',
      props: {
        page: 'Editar Habitación',
      },
      component: () => import('../views/form-habitaciones/EditarHabitacionesView.vue'),
    },
  ],
})

export default router

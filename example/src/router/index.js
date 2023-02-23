// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    children: [
      {
        path: '',
        name: 'EmailLogin',
        component: () => import(/* webpackChunkName: "login" */ '@/views/login/EmailLogin.vue'),
      },
      {
        path: 'phone',
        name: 'PhoneLogin',
        component: () => import(/* webpackChunkName: "login" */ '@/views/login/PhoneLogin.vue'),
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

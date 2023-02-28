// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    meta: { needAuth: true },
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
      },
      {
        path: 'sns',
        name: 'SnsLogin',
        component: () => import(/* webpackChunkName: "login" */ '@/views/login/SnsLogin.vue'),
      }
    ],
    meta: { needNonAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

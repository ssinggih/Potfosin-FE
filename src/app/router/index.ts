import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@features/landing/pages/LandingPage.vue'),
  },
  {
    path: '/projects/:id',
    name: 'project-detail',
    component: () => import('@features/projects/pages/ProjectDetailPage.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@features/dashboard/pages/AdminDashboard.vue'),
    meta: { requiresAuth: true },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('accessToken')
  if (to.meta?.requiresAuth && !token) {
    next('/')
  } else {
    next()
  }
})

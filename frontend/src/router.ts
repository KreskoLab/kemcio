import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router' 

const routes: Array<RouteRecordRaw> = [
  {
    path: "/devices",
    name: "devices",
    components: {
      default: () => import('@/pages/devices.vue'),
      SideNav: () => import('@/components/SideNav/SideNav.vue')
    }
  },
  {
    path: "/:page/new",
    name: "new",
    components: {
      default: () => import('@/pages/new.vue'),
      SideNav: () => import('@/components/SideNav/SideNav.vue')
    }
  },
  {
    path: "/login",
    name: "login",
    components: {
      default: () => import('@/pages/login.vue')
    }
  },
] 

const router = createRouter({ 
  history: createWebHistory(), 
  routes
}) 

export default router

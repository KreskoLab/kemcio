import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { auth } from './middlewares/auth'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'index',
		beforeEnter: auth,
		components: {
			default: () => import('@/pages/index.vue'),
			Sidenav: () => import('@/components/TheSidenav.vue'),
			Navbar: () => import('@/components/TheNavbar.vue')
		},
	},

	{
		path: '/workflows',
		name: 'workflows',
		beforeEnter: auth,
		components: {
			default: () => import('@/pages/workflows/index.vue'),
			Sidenav: () => import('@/components/TheSidenav.vue'),
			Navbar: () => import('@/components/TheNavbar.vue')
		},
	},

	{
		path: '/settings',
		name: 'settings',
		beforeEnter: auth,
		components: {
			default: () => import('@/pages/settings/index.vue'),
			Sidenav: () => import('@/components/TheSidenav.vue'),
			Navbar: () => import('@/components/TheNavbar.vue')
		},
		children: [
			{
				path: 'user',
				components: {
					default: () => import('@/pages/settings/user.vue'),
				},
			},
			{
				path: 'users',
				components: {
					default: () => import('@/pages/settings/users.vue'),
				},
			}
		]
	},

	{
		path: '/new',
		name: 'devices-new',
		components: {
			default: () => import('@/pages/new.vue'),
			Sidenav: () => import('@/components/TheSidenav.vue'),
			Navbar: () => import('@/components/TheNavbar.vue')
		},
	},

	{
		path: '/workflows/:id',
		name: 'workflows-id',
		beforeEnter: auth,
		components: {
			default: () => import('@/pages/workflows/id.vue'),
			Sidenav: () => import('@/components/TheSidenav.vue'),
			Navbar: () => import('@/components/TheNavbar.vue')
		},
	},

	{
		path: '/login',
		name: 'login',
		components: {
			default: () => import('@/pages/login.vue'),
		},
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router

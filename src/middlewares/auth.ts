import { useUser } from '@/store/user'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export async function auth(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
	const userStore = useUser()
	const loggedIn = userStore.loggedIn

	if (loggedIn) {
		next()
	} else {
		try {
			await userStore.getUserData()
			next()
		} catch (err) {
			next('/login')
		}
	}
}

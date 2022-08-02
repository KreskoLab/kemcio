import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import router from '@/router'
import type { User } from '@/models'
import { ROLE } from '@/enums/role'

export const useUser = defineStore('user', {
	state: () => {
		return {
			user: {
				_id: '',
				name: '',
				login: '',
				role: ROLE.GUEST
			} as User,
			accessToken: '',
			loggedIn: false,
		}
	},

	actions: {
		async logIn(login: string, password: string): Promise<string> {
			try {
				await axios
					.post<string>('/auth/login', {
						login,
						password,
					})
					.then((res) => this.setAccessToken(res.data))

				return 'ok'
			} catch (error) {
				const err = error as AxiosError

				if (!err.code && !err.response) return "Нема з'єднання з сервером"
				else return err.response?.data
			}
		},

		async logOut(): Promise<void> {
			try {
				await axios.post<string>('/auth/logout')
			} catch (error) {}

			this.accessToken = ''
			this.loggedIn = false

			router.push('/login')
		},

		async getUser() {
			await axios.post<User>('/auth/me').then((res) => {
					this.user = res.data
					this.setLoggedIn(true)
				})
				.catch(() => {
					this.setLoggedIn(false)
					router.push('/login')
				})
		},

		async getAccessToken() {
			try {
				await axios.post<string>('/auth/token').then((res) => {
					this.setAccessToken(res.data)
					this.refreshAccessToken()
				})
			} catch (error) {
				this.setLoggedIn(false)
				router.push('/login')
			}
		},

		setAccessToken(token: string) {
			this.accessToken = token
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
		},

		setLoggedIn(val: boolean) {
			this.loggedIn = val
		},

		refreshAccessToken() {
			const interval = 3500000 // ~ 1h

			setInterval(async () => {
				try {
					await this.getAccessToken()
				} catch (error) {
					this.setLoggedIn(false)
					router.push('/login')
				}
			}, interval)
		},
	},
})

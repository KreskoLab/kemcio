import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import router from '@/router'

export const useUser = defineStore('user', {
	state: () => {
		return {
			_id: '',
			name: '',
			login: '',
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

		async getUser() {
			await axios
				.post('/auth/me')
				.then((res) => {
					this._id = res.data._id
					this.name = res.data.name
					this.login = res.data.login

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

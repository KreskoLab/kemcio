import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'

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
				const res = await axios.post(
					`${import.meta.env.VITE_API}/users/login`,
					{
						login,
						password,
					},
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					}
				)

				this.setAccessToken(res.data.accessToken)
				await this.getUserData()

				return 'ok'
			} catch (error) {
				const err = error as AxiosError

				if (!err.code && !err.response) return "Нема з'єднання з сервером"
				else return err.response?.data
			}
		},

		async getUserData() {
			const res = await axios.get(`${import.meta.env.VITE_API}/users/me`, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
				},
			})

			console.log(res)

			if (res.data.user) {
				this._id = res.data.user._id
				this.name = res.data.user.name
				this.login = res.data.user.login

				if (res.data.accessToken) {
					this.setAccessToken(res.data.accessToken)
				}

				this.setLoggedIn(true)
			}
		},

		setAccessToken(token: string) {
			this.accessToken = token
		},

		setLoggedIn(val: boolean) {
			this.loggedIn = val
		},
	},
})

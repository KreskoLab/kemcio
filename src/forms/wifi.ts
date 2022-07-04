import type { FormItem } from '@/models'

export const useWiFiForm = (): FormItem[] => [
	{
		name: 'ssid',
		label: 'Назва',
		placeholder: 'Назва WiFi мережі',
		component: 'AppInput',
		value: '',
		validations: {
			required: {
				params: null,
				message: 'Введіть назву WiFi мережі',
			},
		},
	},

	{
		name: 'pass',
		label: 'Пароль',
		placeholder: 'Пароль WiFi мережі',
		component: 'AppInput',
		value: '',
		password: true,
		validations: {
			required: {
				params: null,
				message: 'Введіть пароль WiFi мережі',
			},
		},
	},
]

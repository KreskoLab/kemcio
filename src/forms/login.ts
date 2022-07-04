import type { FormItem } from '@/models'

export const useLoginForm = (): FormItem[] => [
	{
		name: 'login',
		label: 'Логін',
		placeholder: 'Ваш логін',
		component: 'AppInput',
		value: '',
		validations: {
			required: {
				params: null,
				message: 'Введіть логін',
			},
		},
	},

	{
		name: 'password',
		label: 'Пароль',
		placeholder: 'Ваш пароль',
		component: 'AppInput',
		password: true,
		value: '',
		validations: {
			required: {
				params: null,
				message: 'Введіть пароль',
			},
			minLength: {
				params: 6,
				message: 'Пароль має бути більше 6 символів',
			},
		},
	},
]

import type { FormItem } from '@/models'
import { useLoginForm } from './login'

export const useAccountForm = (): FormItem[] => {
	const loginForm = useLoginForm()

	return [
		{
			name: 'name',
			label: "Ім'я",
			placeholder: "Ваше ім'я",
			component: 'AppInput',
			value: '',
			validations: {
				required: {
					params: null,
					message: "Введіть ім'я",
				},
			},
		},
		...loginForm,
	]
}

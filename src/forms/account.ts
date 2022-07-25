import { ROLE } from '@/enums/role'
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
		{
			name: 'role',
			label: 'Роль',
			placeholder: 'Обрати',
			component: 'AppSelect',
			value: '',
			validations: {
				required: {
					params: null,
					message: 'Оберіть роль',
				},
			},
			options: [
				{
					label: 'Адміністратор',
					value: ROLE.ADMIN,
				},
				{
					label: 'Гість',
					value: ROLE.GUEST,
				},
			],
		},
	]
}

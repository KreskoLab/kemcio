import type { FormItem } from '@/models'

export const useDeviceForm = (): FormItem[] => {
	return [
		{
			name: 'deviceName',
			label: 'Назва',
			placeholder: 'Чайник',
			component: 'AppInput',
			value: '',
			options: [],
			validations: {
				required: {
					params: null,
					message: 'Введіть назву пристрою',
				},
			},
		},

		{
			name: 'vendor',
			label: 'Вендор',
			placeholder: 'Обрати',
			component: 'AppSelect',
			options: [],
			value: '',
			validations: {
				required: {
					params: null,
					message: 'Оберіть вендора',
				},
			},
		},

		{
			name: 'device',
			label: 'Пристрій',
			placeholder: 'Обрати',
			options: [],
			value: '',
			component: 'AppSelect',
			validations: {
				required: {
					params: null,
					message: 'Оберіть пристрій',
				},
			},
		},
	]
}

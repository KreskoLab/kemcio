import type { FormItem } from '@/models'

export const usePinForm = (): FormItem[] => {
	return [
		{
			name: 'pin',
			label: 'Пін',
			placeholder: 'Номер піна',
			component: 'AppSelect',
			value: '',
			options: [
				{
					label: 'D1',
					value: 'GPIO5',
				},
				{
					label: 'D2',
					value: 'GPIO4',
				},
				{
					label: 'D3',
					value: 'GPIO0',
				},
				{
					label: 'D4',
					value: 'GPIO2',
				},
				{
					label: 'D5',
					value: 'GPIO14',
				},
				{
					label: 'D6',
					value: 'GPIO12',
				},
				{
					label: 'D7',
					value: 'GPIO13',
				},
			],
			validations: {
				required: {
					params: null,
					message: 'Оберіть пін',
				},
			},
		},

		{
			name: 'interval',
			label: 'Інтервал',
			placeholder: 'Інтервал збереження',
			component: 'AppSelect',
			value: '',
			options: [
				{
					label: '1 хвилина',
					value: 60000,
				},
				{
					label: '5 хвилин',
					value: 300000,
				},
				{
					label: '10 хвилин',
					value: 600000,
				},
				{
					label: '15 хвилин',
					value: 900000,
				},
				{
					label: '30 хвилин',
					value: 1800000,
				},
				{
					label: '1 година',
					value: 3600000,
				},
				{
					label: '2 години',
					value: 7200000,
				},
				{
					label: '3 години',
					value: 10800000,
				},
				{
					label: '6 годин',
					value: 14400000,
				},
				{
					label: '8 годин',
					value: 28800000,
				},
				{
					label: '10 годин',
					value: 36000000,
				},
			],
			validations: {
				required: {
					params: null,
					message: 'Оберіть інтервал',
				},
			},
		},
	]
}

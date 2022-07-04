import type { FormItem } from '@/models'

export const useTriggerForm = (): FormItem[] => {
	return [
		{
			name: 'option',
			label: 'Тріггер',
			placeholder: 'Обрати',
			component: 'AppSelect',
			value: '',
			options: [
				{
					label: 'Інтервал',
					value: 'interval',
				},
			],
			validations: {
				required: {
					params: null,
					message: 'Оберіть тріггер',
				},
			},
		},

		{
			name: 'value',
			label: 'Інтервал',
			placeholder: 'Інтервал виконання',
			component: 'AppSelect',
			value: '',
			options: [
				{
					label: '30 секунд',
					value: '30 * * * * *',
				},
				{
					label: '1 хвилина',
					value: '*/1 * * * *',
				},
				{
					label: '5 хвилин',
					value: '*/5 * * * *',
				},
				{
					label: '10 хвилин',
					value: '*/10 * * * *',
				},
				{
					label: '15 хвилин',
					value: '*/15 * * * *',
				},
				{
					label: '30 хвилин',
					value: '*/30 * * * *',
				},
				{
					label: '1 година',
					value: '0 */1 * * *',
				},
				{
					label: '2 години',
					value: '0 */2 * * *',
				},
				{
					label: '3 години',
					value: '0 */3 * * *',
				},
				{
					label: '6 годин',
					value: '0 */6 * * *',
				},
				{
					label: '8 годин',
					value: '0 */8 * * *',
				},
				{
					label: '10 годин',
					value: '0 */10 * * *',
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

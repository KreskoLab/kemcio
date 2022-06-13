import { OptionModel } from './option-model'

export type FormItem = {
	name: string
	label: string
	placeholder: string
	component: string
	options?: OptionModel[]
	validations: {
		required: {
			params: null
			message: string
		}
	}
}

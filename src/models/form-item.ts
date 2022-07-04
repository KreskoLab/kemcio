import { OptionModel } from './option-model'

type Validation = {
	[key: string]: {
		params: any
		message: string
	}
}

export type FormItem = {
	name: string
	label: string
	placeholder: string
	password?: boolean
	component: string
	value: string | number | boolean
	options?: OptionModel[]
	validations: Validation
}

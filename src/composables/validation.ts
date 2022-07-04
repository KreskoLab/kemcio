import { FormItem } from '@/models'
import * as Validators from '@vuelidate/validators'

export const useValidation = (schema: FormItem[]) => {
	const validations: { [key: string]: any } = {}

	schema.forEach((item) => {
		Object.assign(validations, { [item.name]: {} })

		for (const [childKey, childValue] of Object.entries(item.validations)) {
			if (childValue.params) {
				const rule = { [childKey]: { ...(Validators as any)[childKey](childValue.params) } }
				Object.assign(validations[item.name], rule)
			} else {
				const rule = { [childKey]: { ...(Validators as any)[childKey] } }
				Object.assign(validations[item.name], rule)
			}

			validations[item.name][childKey].$message = childValue.message
		}
	})

	return validations
}

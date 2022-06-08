import * as Validators from '@vuelidate/validators'

export const useValidation = (schema: object[]) => {
	const validations: { [key: string]: any } = {}

	for (const [key, value] of Object.entries(schema)) {
		for (const [childKey, childValue] of Object.entries(value.validations)) {
			validations[value.name] = { [childKey]: { ...(Validators as any)[childKey] } }
			validations[value.name][childKey].$message = childValue.message
		}
	}

	return validations
}

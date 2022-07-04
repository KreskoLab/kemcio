<template>
	<form
		class="flex flex-col items-center space-y-3 w-full"
		@submit.prevent
	>
		<div
			v-for="(item, i) in schema[step - 1]"
			:key="i"
			class="w-full"
		>
			<component
				:is="components[item.component as keyof typeof components]"
				v-model="form[item.name]"
				:label="item.label"
				:placeholder="item.placeholder"
				:password="item.password"
				:options="item.options"
				:error="v$[item.name].$error"
				:error-message="v$[item.name].$errors[0]?.$message"
			/>
		</div>
	</form>

	<div
		v-if="steps > 1"
		class="flex items-end space-x-6 justify-end !mt-6"
	>
		<div class="w-max">
			<AppButton
				v-if="step !== 1"
				transparent
				@click="prevStep()"
			>
				<i-lucide-corner-down-left />
			</AppButton>
		</div>

		<div class="min-w-24">
			<AppButton @click="nextStep()">Далі</AppButton>
		</div>
	</div>
</template>

<script
	setup
	lang="ts"
>
import AppSelect from '@/components/App/AppSelect.vue'
import AppInput from '@/components/App/AppInput.vue'
import useVuelidate from '@vuelidate/core'
import type { FormItem } from '@/models'
import { useValidation } from '@/composables/validation'
import { computed, reactive } from '@vue/reactivity'
import { watch, markRaw } from 'vue'

const components = {
	AppInput,
	AppSelect,
}

const props = defineProps<{
	schema: FormItem[][]
	step: number
	steps: number
}>()

const emit = defineEmits<{
	(event: 'next'): void
	(event: 'prev'): void
	(event: 'input', form: object): void
}>()

const form: { [key: string]: string | number | boolean } = reactive({})

const validationRules = computed(() => useValidation(props.schema[props.step - 1]))
const v$ = useVuelidate(validationRules, form)

watch(
	props.schema,
	() => {
		for (let index in props.schema[props.step - 1]) {
			const item = markRaw(props.schema[props.step - 1][index])

			if (form[item.name] == undefined) {
				form[item.name] = item.value
			}
		}
	},
	{ deep: true, immediate: true }
)

watch(form, (val) => {
	emit('input', val)
})

async function nextStep() {
	if (await validateForm()) {
		emit('next')
	}
}

function prevStep() {
	emit('prev')
}

async function validateForm() {
	await v$.value.$validate()

	if (!v$.value.$error) {
		return true
	} else {
		return false
	}
}

function resetValidation() {
	v$.value.$reset()
}

defineExpose({
	validateForm,
	resetValidation,
})
</script>

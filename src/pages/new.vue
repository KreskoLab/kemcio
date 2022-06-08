<template>
	<div class="page flex flex-col space-y-6 items-center lg:(space-y-8 justify-center) h-full">
		<div class="w-full px-4 lg:(w-2xl px-12)">
			<UiSteps
				:steps="3"
				:step="step"
			/>
		</div>

		<div class="form flex flex-col items-center min-w-full lg:(min-w-2xl py-6 h-max) h-full">
			<h1 class="title w-8/12 text-3xl mb-4">
				{{ title }}
			</h1>

			<form
				v-show="step < steps"
				class="flex flex-col items-center space-y-3 w-full"
				@submit.prevent
			>
				<div
					v-for="(item, i) in schemas[step - 1]"
					:key="i"
					class="w-8/12"
				>
					<component
						:is="components[item.component]"
						v-model="form[item.name]"
						:label="item.label"
						:placeholder="item.placeholder"
						:options="item.options"
						:error="v$[item.name].$error"
						:error-message="v$[item.name].$errors[0]?.$message"
					/>
				</div>
			</form>

			<div
				v-if="step === steps"
				class="flex justify-center w-8/12 my-8"
			>
				<TheFirmware
					:form="form"
					@uploaded="addDevice($event)"
				/>
			</div>

			<div
				v-if="step !== 3"
				class="flex items-end space-x-6 justify-end w-8/12 !mt-6"
			>
				<div
					v-if="step == 2"
					class="w-max"
				>
					<AppButton
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
		</div>
	</div>
</template>

<script
	setup
	lang="ts"
>
import AppSelect from '@/components/App/AppSelect.vue'
import AppInput from '@/components/App/AppInput.vue'
import UiSteps from '@/components/UI/UiSteps.vue'
import AppButton from '@/components/App/AppButton.vue'
import TheFirmware from '@/components/TheFirmware.vue'

import type { Vendor, VendorDevice, NewDevice } from '@/models/models'
import { onBeforeMount, ref, watch, reactive } from 'vue'
import { computed } from '@vue/reactivity'

import newDevice from '@/schemas/new-device.json'
import wifi from '@/schemas/wifi.json'

import useVuelidate from '@vuelidate/core'
import { useValidation } from '@/composables/validation'
import axios from 'axios'
import router from '@/router'

const steps = ref<number>(3)
const step = ref<number>(1)
const formStep = ref<number>(0)

const components = {
	AppInput: AppInput,
	AppSelect: AppSelect,
}

const form: { [key: string]: string } = reactive({})

const title = computed(() => {
	switch (step.value) {
		case 1:
			return 'Новий пристрій'

		case 2:
			return 'Дані WiFi мережі'

		case 3:
			return 'Завантаження прошивки'
	}
})

const schemas = ref([newDevice, wifi])

for (let index in schemas.value[formStep.value]) {
	const item = schemas.value[formStep.value][index]
	form[item.name] = ''
}

const validationRules = computed(() => useValidation(schemas.value[formStep.value]))

const v$ = useVuelidate(validationRules, form)

const res = (await axios.get(`${import.meta.env.VITE_API}/devices/vendors`)).data

onBeforeMount(async () => {
	const schema = schemas.value[0]
	const vendors = schema[1]

	vendors.options = res.map((item: Vendor) => ({
		label: item.name,
		value: item.slug,
	}))
})

watch(
	() => form.vendor,
	() => {
		const schema = schemas.value[0]
		const devices = schema[2]

		devices.options = res
			.find((item: Vendor) => item.slug === form.vendor)
			.devices.map((device: VendorDevice) => ({
				label: device.name,
				value: device,
			}))
	}
)

function nextStep() {
	v$.value.$validate()

	if (!v$.value.$error && step.value < steps.value) {
		step.value++

		if (step.value < steps.value) formStep.value++
	}
}

function prevStep() {
	step.value--
	formStep.value--
}

async function addDevice(device: NewDevice) {
	await axios.post(`${import.meta.env.VITE_API}/devices`, device)
	router.push('/devices')
}
</script>

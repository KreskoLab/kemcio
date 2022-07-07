<template>
	<div
		class="page flex flex-col space-y-6 pt-28 md:(pl-28 pr-10) lg:(space-y-8 justify-center items-center pt-0) h-full"
	>
		<div class="w-full px-4 lg:(w-2xl px-12)">
			<AppSteps
				:steps="steps"
				:step="step"
			/>
		</div>

		<div class="form flex flex-col items-center min-w-full lg:(min-w-2xl py-6)">
			<h1 class="title w-8/12 text-xl text-center mt-4 lg:(text-3xl mb-4 mt-0)">
				{{ title }}
			</h1>

			<div
				v-if="step > steps"
				class="flex justify-center w-10/12 my-6 md:(w-8/12 my-8)"
			>
				<TheFirmware
					:pin="form.pin"
					:gpio="form.device.gpio"
					:interval="form.interval"
					:firmware="form.device.value"
					:ssid="form.ssid"
					:pass="form.pass"
					:name="form.deviceName"
					:type="form.device.type"
					:vendor="form.vendor"
					:device="form.device.name"
					@uploaded="$router.push('/')"
				/>
			</div>

			<div
				v-else
				class="w-8/12 mb-5 lg:(mb-0)"
			>
				<AppForm
					:schema="schemas"
					:step="step"
					:steps="steps"
					@next="step++"
					@prev="step--"
					@input="Object.assign(form, $event)"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import AppSteps from '@/components/App/AppSteps.vue'
import TheFirmware from '@/components/TheFirmware.vue'
import AppForm from '@/components/App/AppForm.vue'
import axios from 'axios'
import type { Vendor, VendorDevice, FormItem } from '@/models'
import { onBeforeMount, ref, watch, reactive } from 'vue'
import { computed } from '@vue/reactivity'
import { useDeviceForm, usePinForm, useWiFiForm } from '@/forms'

const schemas = ref<FormItem[][]>([useDeviceForm(), useWiFiForm()])
const step = ref<number>(1)

const steps = computed(() => schemas.value.length)

const form = reactive({
	deviceName: '',
	vendor: '',
	device: {} as VendorDevice,
	ssid: '',
	pass: '',
	pin: '',
	interval: 0,
})

const title = computed(() => {
	if (steps.value === 2) {
		switch (step.value) {
			case 1:
				return 'Новий пристрій'

			case 2:
				return 'Дані WiFi мережі'

			case 3:
				return 'Завантаження прошивки'
		}
	} else {
		switch (step.value) {
			case 1:
				return 'Новий пристрій'

			case 2:
				return 'Дані WiFi мережі'

			case 3:
				return 'Дані датчика'

			case 4:
				return 'Завантаження прошивки'
		}
	}
})

const res = await axios.get<Vendor[]>('/devices/vendors').then((res) => res.data)

onBeforeMount(async () => {
	const schema = schemas.value[0]
	const vendors = schema[1]

	vendors.options = res.map((item) => ({
		label: item.name,
		value: item.slug,
	}))
})

watch(
	() => form.vendor,
	() => {
		const schema = schemas.value[0]
		const devices = schema[2]

		const vendor = res.find((item) => item.slug === form.vendor)

		if (vendor) {
			devices.options = vendor.devices.map((device) => ({
				label: device.name,
				value: device,
			}))
		}
	}
)

watch(
	() => form.device.type,
	(val: string) => {
		const pinForm = usePinForm()

		if (val === 'sensor') {
			if (!schemas.value.includes(pinForm)) schemas.value.push(pinForm)
		} else {
			if (schemas.value.includes(pinForm)) schemas.value.pop()
		}
	}
)
</script>

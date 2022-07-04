<script
	setup
	lang="ts"
>
import AppModal from '@/components/App/AppModal.vue'
import AppTabs from '@/components/App/AppTabs.vue'
import AppTabItem from '@/components/App/AppTabItem.vue'
import AppButton from '@/components/App/AppButton.vue'
import AppSpinner from '@/components//App/AppSpinner.vue'
import AppForm from '@/components/App/AppForm.vue'
import { AxiosStatic } from 'axios'
import { useDeviceForm, usePinForm, useWiFiForm } from '@/forms'
import { useIcon } from '@/composables/get-icon'
import type { FormItem, Device, DeviceType } from '@/models'
import { inject, reactive, ref, watch } from 'vue'

interface WiFi {
	SSId1: string
	SSId2: string
	Password1?: string
	Password2?: string
}

const props = defineProps<{
	id: string
	name: string
	device: string
	icon: string
	type: DeviceType
	interval?: number
	pin?: string
	online: boolean
}>()

const emit = defineEmits<{
	(event: 'close'): void
}>()

const axios = inject('axios') as AxiosStatic

const currentTab = ref<number>(0)

const mainFormComponent = ref<InstanceType<typeof AppForm> | null>(null)
const wifiFormComponent = ref<InstanceType<typeof AppForm> | null>(null)

const mainForm = reactive<Partial<Pick<Device, 'name' | 'pin' | 'interval'>>>({})
const wifiForm = reactive<Partial<WiFi>>({})

const mainSchema = ref<FormItem[][]>([[]])
const wifiSchema = ref<FormItem[][]>([[]])

watch(
	currentTab,
	async (tab) => {
		switch (tab) {
			case 0:
				if (mainSchema.value[0].length === 0) {
					const deviceForm = useDeviceForm()[0]
					deviceForm.name = 'name'
					deviceForm.value = props.name

					mainSchema.value[0].push(deviceForm)

					if (props.type === 'sensor') {
						const pinForm = usePinForm()[0]
						pinForm.value = props.pin as string

						const intervalForm = usePinForm()[1]
						intervalForm.value = props.interval as number

						mainSchema.value[0].push(pinForm, intervalForm)
					}
				}

				break

			case 1:
				if (wifiSchema.value[0].length === 0) {
					const wifi = await getWiFi()
					const wifiForm = useWiFiForm()

					wifiForm[0].name = 'SSId1'
					wifiForm[0].value = wifi.SSId1
					wifiForm[1].name = 'Password1'

					wifiSchema.value[0].push(...wifiForm)
				}

				break
		}
	},
	{ immediate: true }
)

async function getWiFi() {
	return axios.get<WiFi>(`/devices/${props.id}/wifi`).then((res) => res.data)
}

async function updateDevice() {
	if (Object.keys(mainForm).length) {
		await axios.put(`/devices/${props.id}`, mainForm)
	}
}

async function removeDevice() {
	await axios.delete(`/devices/${props.id}`)
}

async function updateWiFi() {
	if (Object.keys(wifiForm).length) {
		await axios.put(`/devices/${props.id}/wifi`, wifiForm)
	}
}
</script>

<template>
	<AppModal
		size="lg"
		@close="$emit('close')"
	>
		<template #header>
			<div class="flex items-center space-x-4">
				<svg
					viewBox="0 0 24 24"
					class="h-10 w-10 dark:text-light-800"
					v-html="useIcon(icon)"
				/>

				<div>
					<h1 class="dark:text-light-200 text-xl font-medium">{{ name }}</h1>
					<h2 class="subtitle">{{ device }}</h2>
				</div>
			</div>
		</template>

		<template #body>
			<AppTabs v-model="currentTab">
				<AppTabItem label="Пристрій">
					<AppForm
						ref="mainFormComponent"
						:steps="1"
						:step="1"
						:schema="mainSchema"
						@input="Object.assign(mainForm, $event)"
					/>

					<AppButton
						class="mt-4"
						@click="mainFormComponent?.validateForm() && updateDevice()"
					>
						Зберегти
					</AppButton>
				</AppTabItem>

				<AppTabItem
					v-if="online"
					label="WiFi"
				>
					<div v-if="wifiSchema[0].length">
						<AppForm
							ref="wifiFormComponent"
							:steps="1"
							:step="1"
							:schema="wifiSchema"
							@input="Object.assign(wifiForm, $event)"
						/>

						<AppButton
							class="mt-4"
							@click="wifiFormComponent?.validateForm() && updateWiFi()"
						>
							Зберегти
						</AppButton>
					</div>

					<div
						v-else
						class="flex justify-center pt-4"
					>
						<AppSpinner />
					</div>
				</AppTabItem>

				<AppTabItem v-if="type === 'sensor'" label="Графік">Графік</AppTabItem>
				<AppTabItem label="Система">
					<div>
						<h1 class="title !text-red-500">Видалити пристрій</h1>
						<p class="subtitle pt-2">Усі данні пристрою буде видаленно! Прошивка увімкне оффлайн режим.</p>

						<AppButton
							class="w-32 bg-red-500 mt-6"
							@click="removeDevice()"
						>
							Видалити
						</AppButton>
					</div>
				</AppTabItem>
			</AppTabs>
		</template>
	</AppModal>
</template>

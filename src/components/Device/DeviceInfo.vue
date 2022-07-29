<script setup lang="ts">
import AppModal from '@/components/App/Modal/AppModal.vue'
import AppTabs from '@/components/App/AppTabs.vue'
import AppTabItem from '@/components/App/AppTabItem.vue'
import AppButton from '@/components/App/AppButton.vue'
import AppSpinner from '@/components//App/AppSpinner.vue'
import AppForm from '@/components/App/AppForm.vue'
import AppSegments from '@/components/App/AppSegments.vue'
import ChartLine from '@/components/Chart/ChartLine.vue'
import { AxiosError, AxiosStatic } from 'axios'
import { useDeviceForm, usePinForm, useWiFiForm } from '@/forms'
import { useIcon } from '@/composables/get-icon'
import type { FormItem, Device, DeviceType, DeviceElement, ElementsData, Period, ModalSize } from '@/models'
import { inject, onBeforeMount, reactive, ref, watch } from 'vue'
import { ElementData } from '@braks/vue-flow'
import { useMain } from '@/store/main'
import { useToast } from '@/composables/toast'

interface WiFi {
	SSId1: string
	SSId2: string
	Password1?: string
	Password2?: string
}

const props = defineProps<{
	id: string
	name: string
	online: boolean
	device: string
	icon: string
	type: DeviceType
	interval?: number
	pin?: string
	elements?: DeviceElement[]
}>()

defineEmits<{
	(event: 'close'): void
}>()

const axios = inject('axios') as AxiosStatic

const mainStore = useMain()

const currentTab = ref<number>(0)

const mainFormComponent = ref<InstanceType<typeof AppForm> | null>(null)
const wifiFormComponent = ref<InstanceType<typeof AppForm> | null>(null)

const mainForm = reactive<Partial<Pick<Device, 'name' | 'pin' | 'interval'>>>({})
const wifiForm = reactive<Partial<WiFi>>({})

const mainSchema = ref<FormItem[][]>([[]])
const wifiSchema = ref<FormItem[][]>([[]])

const deviceElements = reactive<Pick<DeviceElement, 'name' | 'element'>[]>([])
const elementsData = reactive<ElementsData>({})

const chartPeriod = ref<Period>('day')
const modalSize = ref<ModalSize>('lg')

const segmnets = [
	{
		name: 'День',
		value: 'day',
	},
	{
		name: 'Тиждень',
		value: 'week',
	},
	{
		name: 'Місяць',
		value: 'month',
	},
]

onBeforeMount(() => {
	if (props.elements) {
		const items = props.elements.map(({ name, element }) => ({ name, element: element.toLowerCase() }))
		deviceElements.push(...items)
	}
})

watch(
	currentTab,
	async (tab) => {
		switch (tab) {
			case 0:
				modalSize.value = 'lg'

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
				modalSize.value = 'lg'

				if (wifiSchema.value[0].length === 0) {
					const wifi = await getWiFi()
					const wifiForm = useWiFiForm()

					wifiForm[0].name = 'SSId1'
					wifiForm[0].value = wifi.SSId1
					wifiForm[1].name = 'Password1'

					wifiSchema.value[0] = []
					wifiSchema.value[0].push(...wifiForm)
				}

				break

			case 2:
				modalSize.value = 'lg'
				break

			case 3:
				modalSize.value = 'xl'

				if (props.elements?.length) {
					for (const item of deviceElements) {
						elementsData[item.element] = await getElementData(item.element)
					}
				}

				break
		}
	},
	{ immediate: true }
)

watch(chartPeriod, async () => {
	for (const item of deviceElements) {
		elementsData[item.element] = await getElementData(item.element)
	}
})

async function getWiFi() {
	return axios.get<WiFi>(`/devices/${props.id}/wifi`).then((res) => res.data)
}

async function updateDevice() {
	if (Object.keys(mainForm).length) {
		try {
			await axios.put(`/devices/${props.id}`, mainForm)

			mainStore.updateCounter()
			useToast('Пристрій оновлен', 'success')
		} catch (error) {
			const err = error as AxiosError
			useToast(err.response?.data, 'error')
		}
	}
}

async function removeDevice() {
	try {
		await axios.delete(`/devices/${props.id}`)

		mainStore.updateCounter()
		useToast('Пристрій видален', 'success')
	} catch (error) {
		const err = error as AxiosError
		useToast(err.response?.data, 'error')
	}
}

async function updateWiFi() {
	if (Object.keys(wifiForm).length) {
		try {
			await axios.put(`/devices/${props.id}/wifi`, wifiForm)
			useToast('Данны WiFi оновлено', 'success')
		} catch (error) {
			const err = error as AxiosError
			useToast(err.response?.data, 'error')
		}
	}
}

async function getElementData(element: string) {
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

	return axios
		.get<ElementData[]>(`/devices/${props.id}/data/${element}?period=${chartPeriod.value}&tz=${timezone}`)
		.then((res) => res.data)
}
</script>

<template>
	<AppModal
		:size="modalSize"
		@close="$emit('close')"
	>
		<template #header>
			<div class="flex items-center space-x-4">
				<svg
					viewBox="0 0 24 24"
					class="h-8 w-8 sm:(h-10 w-10) title"
					v-html="useIcon(icon)"
				/>

				<div>
					<h1 class="title text-lg sm:text-xl">{{ name }}</h1>
					<h2 class="subtitle text-xs sm:text-base">{{ device }}</h2>
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

				<AppTabItem label="WiFi">
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

				<AppTabItem label="Система">
					<div>
						<h1 class="title !text-red-500">Видалити пристрій</h1>
						<p class="subtitle pt-2">Усі данні пристрою буде видаленно! Прошивка увімкне оффлайн режим.</p>

						<AppButton
							variant="danger"
							class="w-32 mt-6"
							@click="removeDevice()"
						>
							Видалити
						</AppButton>
					</div>
				</AppTabItem>

				<AppTabItem
					v-if="type === 'sensor'"
					label="Данні"
				>
					<div class="my-4">
						<AppSegments
							v-model="chartPeriod"
							:segments="segmnets"
						/>
					</div>

					<div
						v-for="item in deviceElements"
						:key="item.element"
						class="mb-4 max-h-[280px]"
					>
						<ChartLine
							v-if="elementsData[item.element]"
							:title="item.name"
							:chart-id="item.element"
							:chart-data="elementsData[item.element]"
							:period="chartPeriod"
							:width="800"
							:height="240"
						/>
					</div>
				</AppTabItem>
			</AppTabs>
		</template>
	</AppModal>
</template>

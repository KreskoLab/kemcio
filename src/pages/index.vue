<script setup lang="ts">
import type { Device, Message } from '@/models'
import AppButton from '@/components/App/AppButton.vue'
import DeviceCard from '@/components/Device/DeviceCard.vue'
import { AxiosStatic } from 'axios'
import { inject, reactive, watch } from 'vue'
import { useMain } from '@/store/main'
import { computed } from '@vue/reactivity'

const axios = inject('axios') as AxiosStatic

const mainStore = useMain()
const updateCounter = computed(() => mainStore.counter)

const devices = reactive<Device[]>([])

await getDevices()

async function getDevices() {
	await axios.get<Device[]>('/devices').then((res) => {
		devices.length = 0
		devices.push(...res.data.sort(({ online }) => (online ? -1 : 1)))

		listenDevices()
	})
}

function listenDevices() {
	const sse = new EventSource(`${import.meta.env.VITE_API}/devices/status`)

	sse.onmessage = (event: MessageEvent) => {
		const { id, ...rest }: Message = JSON.parse(event.data)
		const device = devices.find((item) => item._id === id)

		if (device) {
			if ('online' in rest) {
				device.online = rest.online
				devices.sort(({ online }) => (online ? -1 : 1))
			} else {
				const element = device.elements.find((item) => item.element === rest.element)

				if (element) element.value = rest.value
				else device.elements.push(rest)
			}
		}
	}
}

watch(updateCounter, async () => await getDevices())
</script>

<template>
	<div class="flex flex-col padding min-w-[360px] h-full lg:pr-12">
		<div class="flex items-center space-x-5">
			<h1 class="title text-2xl sm:text-3xl">Пристрої</h1>

			<router-link to="/new">
				<AppButton size="sm">
					<span>новий</span>
				</AppButton>
			</router-link>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-x-12 gap-y-12 pt-8 pb-22 lg:pb-8">
			<DeviceCard
				v-for="device in devices"
				:id="device._id"
				:key="device._id"
				:device="device.device"
				:name="device.name"
				:online="device.online"
				:type="device.type"
				:elements="device.elements"
				:interval="device.interval"
				:pin="device.pin"
			/>
		</div>
	</div>
</template>

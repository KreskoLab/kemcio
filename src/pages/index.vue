<script setup lang="ts">
import AppButton from '@/components/App/AppButton.vue'
import AppCard from '@/components/App/AppCard.vue'
import { AxiosStatic } from 'axios'
import { inject, reactive, watch } from 'vue'
import type { Device } from '@/models'
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
		const msg = JSON.parse(event.data)
		const deviceId = event.lastEventId

		const device = devices.find((item) => item._id === deviceId)

		if (device) {
			if (Array.isArray(msg)) {
				Object.assign(device.elements, msg)
			} else {
				Object.assign(device, msg)
				devices.sort(({ online }) => (online ? -1 : 1))
			}
		}
	}
}

watch(updateCounter, async () => await getDevices())
</script>

<template>
	<div
		class="flex flex-col pt-22 pb-16 px-6 sm:(pl-28 pt-26) lg:(pl-32 pt-8 pb-4) min-w-[360px] h-full overflow-y-auto"
	>
		<div class="flex items-center space-x-5">
			<h1 class="title text-2xl sm:text-3xl">Пристрої</h1>

			<router-link to="/new">
				<AppButton size="sm">
					<span>новий</span>
				</AppButton>
			</router-link>
		</div>

		<div class="flex flex-col items-center gap-y-12 sm:(flex-row flex-wrap items-stretch gap-x-16 my-12) my-8">
			<AppCard
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

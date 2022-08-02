<template>
	<div class="flex justify-center items-center relative w-full h-42 rounded-lg bg-white dark:bg-dark-800">
		<div
			v-if="loading"
			class="flex justify-center pt-4"
		>
			<AppSpinner />
		</div>

		<div
			v-else
			class="flex flex-col items-center space-y-2 z-50 text-slate-700 dark:text-slate-200"
		>
			<template v-if="progress === 0">
				<i-lucide-inspect
					class="w-12 h-12 cursor-pointer"
					@click="flash()"
				/>
			</template>

			<template v-if="flashed">
				<i-lucide-inspect
					class="w-12 h-12 cursor-pointer"
					@click="settings()"
				/>
			</template>

			<p class="text-center text-slate-700 dark:text-gray-400">
				<template v-if="progress === 0">Під'єднайте пристрій до комп'ютера</template>
				<template v-if="flashed">Перепід'єднайте пристрій</template>
			</p>
		</div>

		<span
			v-if="progress > 0 && !flashed"
			class="text-lg z-50 text-slate-700 dark:text-slate-200"
		>
			{{ progress }} %
		</span>

		<div
			v-if="!flashed"
			class="absolute bottom-0 w-full h-1 bg-purple-50 dark:bg-purple-900/40 rounded-md progress"
			:style="{ height: `${progress}%` }"
		/>
	</div>
</template>

<script setup lang="ts">
import { ESPLoader } from 'esp-web-flasher'
import { inject, onBeforeUnmount, reactive, ref } from 'vue'
import { Device } from '@/models'
import { AxiosStatic } from 'axios'
import { useToast } from '@/composables/toast'

interface WebSocketMsg {
	deviceId?: string
	clientId: string
	cmd?: string
}

const props = defineProps<{
	gpio?: string
	pin?: string
	interval?: number
	ssid: string
	pass: string
	firmware: string
	name: string
	vendor: string
	device: string
	type: string
}>()

const emit = defineEmits<{
	(event: 'uploaded'): void
}>()

const axios = inject('axios') as AxiosStatic

const loading = ref(false)
const progress = ref(0)
const flashed = ref(false)
const firmware = ref<Blob>(new Blob())

const flashData = reactive({
	clientId: '',
	deviceId: '',
	cmd: '',
})

await axios
	.get<Blob>(`/devices/firmware?device=${props.firmware}`, {
		responseType: 'blob',
	})
	.then((res) => (firmware.value = res.data))

const socket = new WebSocket(import.meta.env.VITE_WS_URL)

socket.addEventListener('open', function () {
	socket.send(
		JSON.stringify({
			event: 'devices-new',
			data: {
				status: 'init',
				metadata: {
					ssid: props.ssid,
					pass: props.pass,
				},
				device: {
					name: props.name,
					type: props.type,
					vendor: props.vendor,
					device: props.device,
					gpio: props.gpio,
					pin: props.pin,
					interval: props.interval,
				} as Device,
			},
		})
	)
})

socket.addEventListener('message', function (event) {
	const msg = JSON.parse(event.data) as WebSocketMsg
	Object.assign(flashData, msg)
})

onBeforeUnmount(() => {
	if (!flashed.value) closeWebSocket()
})

async function closeWebSocket() {
	socket.send(
		JSON.stringify({
			event: 'devices-new',
			data: {
				status: flashed.value ? 'flashed' : 'aborted',
				clientId: flashData.clientId,
			},
		})
	)

	socket.close()
}

async function flash() {
	try {
		const port = await navigator.serial.requestPort()
		await port.open({ baudRate: 115200 })

		loading.value = true

		const espLoader = new ESPLoader(port, {
			log: (msg) => {
				console.log(msg)
			},
			debug: (msg) => {
				console.log(msg)
			},
			error: (msg) => {
				console.log(msg)
			},
		})

		try {
			await espLoader.initialize()

			let espStub = await espLoader.runStub()
			const firmwareBuff = await firmware.value.arrayBuffer()

			await espStub.eraseFlash()

			await espStub.flashData(firmwareBuff, (bytesWritten, totalBytes) => {
				loading.value = false
				progress.value = Math.floor((bytesWritten / totalBytes) * 100)
			})

			await espLoader.disconnect()
			await espLoader.hardReset()

			flashed.value = true
		} catch (error) {
			loading.value = false
			progress.value = 0

			useToast('Пристрій не відповідає', 'error')
		}
	} catch (error) {
		useToast('Пристрій не знайдено', 'error')
	}
}

async function settings() {
	const port = await navigator.serial.requestPort()
	await port.open({ baudRate: 115200 })

	loading.value = true

	const textEncoder = new TextEncoderStream()
	textEncoder.readable.pipeTo(port.writable as WritableStream<Uint8Array>)

	const writer = textEncoder.writable.getWriter()

	await writer.write(flashData.cmd)
	writer.releaseLock()

	await closeWebSocket()

	setTimeout(() => {
		emit('uploaded')
	}, 10000)
}
</script>

<style scoped>
.progress {
	transition: height 0.5s ease-in-out;
}
</style>

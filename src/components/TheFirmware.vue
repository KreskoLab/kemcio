<template>
	<div class="flex justify-center items-center relative w-full h-42 rounded-lg bg-white dark:bg-dark-800">
		<div
			v-if="progress === 0"
			class="flex flex-col items-center space-y-2 z-50 text-slate-700 dark:text-slate-200"
		>
			<i-lucide-inspect
				class="w-12 h-12 cursor-pointer"
				@click="flash()"
			/>

			<p class="text-center text-slate-700 dark:text-gray-400">Під'єднайте пристрій до комп'ютера</p>
		</div>

		<div
			v-if="flashed"
			class="flex flex-col items-center space-y-2 z-50 text-slate-700 dark:text-slate-200"
		>
			<i-lucide-inspect
				class="w-12 h-12 cursor-pointer"
				@click="settings()"
			/>

			<p class="text-center text-slate-700 dark:text-gray-400">Перепід'єднайте пристрій</p>
		</div>

		<span
			v-if="progress > 0 && !flashed"
			class="text-lg z-50 text-slate-700 dark:text-slate-200"
		>
			{{ progress }} %
		</span>

		<div
			class="absolute bottom-0 w-full h-1 bg-purple-50 dark:bg-purple-900/40 rounded-md progress"
			:style="{ height: `${progress}%` }"
		/>
	</div>
</template>

<script
	setup
	lang="ts"
>
import { ESPLoader } from 'esp-web-flasher'
import { reactive, ref } from 'vue'
import { customAlphabet } from 'nanoid'
import { NewDevice } from '@/models/models'
import axios from 'axios'

const props = defineProps<{
	form: object
}>()

const emit = defineEmits<{
	(event: 'uploaded', newDevice: NewDevice): void
}>()

const progress = ref(0)
const flashed = ref(false)
const firmware = ref<Blob>(new Blob())

const newDevice = reactive<NewDevice>({
	name: props.form.deviceName,
	type: props.form.device.type,
	vendor: props.form.vendor,
	topic: '',
})

const query = ref(props.form.device.value)

firmware.value = (
	await axios.get<Blob>(`${import.meta.env.VITE_API}/devices/firmware?device=${query.value}`, {
		responseType: 'blob',
	})
).data

async function flash() {
	const port = await navigator.serial.requestPort()

	await port.open({ baudRate: 115200 })

	const espLoader = new ESPLoader(port, {
		log: () => {},
		debug: () => {},
		error: () => {},
	})

	await espLoader.initialize()

	let espStub = await espLoader.runStub()

	const firmwareBuff = await firmware.value.arrayBuffer()

	await espStub.eraseFlash()

	await espStub.flashData(firmwareBuff, (bytesWritten, totalBytes) => {
		progress.value = Math.floor((bytesWritten / totalBytes) * 100)
	})

	await espLoader.disconnect()
	await espLoader.hardReset()

	flashed.value = true
}

async function settings() {
	const port = await navigator.serial.requestPort()
	await port.open({ baudRate: 115200 })

	const textEncoder = new TextEncoderStream()
	textEncoder.readable.pipeTo(port.writable)

	const writer = textEncoder.writable.getWriter()

	const topic = customAlphabet('1234567890abcdef', 10)()

	newDevice.topic = topic

	const cmd = `Backlog WebServer 0; Topic ${topic}; SSID1 ${props.form.ssid}; Password1 ${props.form.pass}; MqttHost ${
		import.meta.env.VITE_RABBIT_IP
	}; MqttPort ${import.meta.env.VITE_RABBIT_PORT}; MqttUser ${import.meta.env.VITE_RABBIT_USER}; MqttPassword ${
		import.meta.env.VITE_RABBIT_PASSWORD
	}\n`

	await writer.write(cmd)
	writer.releaseLock()

	emit('uploaded', newDevice)
}
</script>

<style scoped>
.progress {
	transition: height 0.5s ease-in-out;
}
</style>

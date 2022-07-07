<script setup lang="ts">
import AppInfo from '@/components/App/AppInfo.vue'
import AppToggle from '@/components/App/AppToggle.vue'
import AppRange from '@/components/App/AppRange.vue'
import AppColor from '@/components/App/AppColor.vue'
import AppDevice from '@/components/App/AppDevice.vue'
import type { DeviceType, DeviceElement } from '@/models'
import { computed, ref } from 'vue'
import { useIcon } from '@/composables/get-icon'
import axios from 'axios'

const props = defineProps<{
	id: string
	name: string
	device: string
	online: boolean
	type: DeviceType
	pin?: string
	interval?: number
	elements: DeviceElement[]
}>()

const components = {
	POWER: AppToggle,
	TEMPERATURE: AppInfo,
	HUMIDITY: AppInfo,
	Dimmer: AppRange,
	Color: AppColor,
}

const showMore = ref<boolean>(false)
const onlineIndicator = computed(() => (props.online ? 'bg-green-400' : 'bg-red-400'))

const card = computed(() => {
	let res = { bg: '', icon: '' }

	switch (props.type) {
		case 'switch':
			res.bg = 'from-orange-500 to-yellow-500'
			res.icon = 'settings-2'
			break

		case 'sensor':
			res.bg = 'from-sky-500 to-blue-500'
			res.icon = 'thermometer-sun'
			break

		case 'bulb':
			res.bg = 'from-pink-500 to-rose-500'
			res.icon = 'lightbulb'
			break
	}

	return res
})

async function handleInput(element: string, value: string | number) {
	await axios.post(`/devices/${props.id}/command`, {
		name: element,
		value,
	})
}
</script>

<template>
	<AppDevice
		v-if="showMore"
		:id="id"
		:icon="card.icon"
		:device="device"
		:type="type"
		:name="name"
		:pin="pin"
		:interval="interval"
		:online="online"
		:elements="elements"
		@close="showMore = false"
	/>

	<article
		class="flex flex-col bg-gradient-to-br dark:outline-dark-200 outline-light-600 outline rounded-md w-full lg:w-96"
		:class="card.bg"
	>
		<div class="flex items-center space-x-2 bg-dark-800 w-max rounded-br-md px-3 py-1">
			<h1 class="text-light-600 font-medium">{{ name }}</h1>

			<div
				class="rounded-full h-2 w-2"
				:class="onlineIndicator"
			/>
		</div>

		<div class="flex justify-center items-center mx-auto my-4 w-28 h-28 bg-light-50 first second rounded-full">
			<svg
				viewBox="0 0 24 24"
				class="h-10 w-10 dark:text-dark-400"
				v-html="useIcon(card.icon)"
			/>
		</div>

		<div class="flex flex-col space-y-3 my-8">
			<div
				v-for="element in elements"
				:key="element.name"
				class="flex items-center justify-between px-8 py-3"
			>
				<span class="text-light-600 text-lg font-medium">{{ element.name }}</span>

				<component
					:is="components[element.element as keyof typeof components]"
					v-model="element.value"
					:value="element.value"
					:disabled="!online"
					true-value="ON"
					false-value="OFF"
					@input="handleInput(element.element, $event as unknown as string | number)"
				/>
			</div>
		</div>

		<button
			class="flex justify-between items-center mt-auto bg-light-50/10 py-4 px-8"
			@click="showMore = !showMore"
		>
			<span class="text-light-300">Детально</span>
			<i-lucide-arrow-right class="text-dark-600" />
		</button>
	</article>
</template>

<style scoped>
.first {
	box-shadow: 0 0 3px 6px rgba(24, 24, 24, 0.15), 0 0 2px 16px rgba(24, 24, 24, 0.05);
}
</style>

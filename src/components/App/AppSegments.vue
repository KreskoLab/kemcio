<script setup lang="ts">
// 🤡 🤡 🤡

import { markRaw, onMounted, ref, watch } from 'vue'

type Segemnt = {
	name: string
	value: string | number
}

const props = defineProps<{
	modelValue?: Segemnt['value']
	segments: Segemnt[]
}>()

const emit = defineEmits<{
	(event: 'update:modelValue', val: Segemnt['value']): void
}>()

const selected = ref<Segemnt>()
const opacity = ref<string>('')
const bgPosition = ref<number>(0)
const bgWidth = ref<number>(0)
const items = ref<HTMLElement[]>([])

onMounted(() => {
	const { modelValue, segments } = markRaw(props)

	if (modelValue) {
		const index = props.segments.findIndex((segment) => segment.value === modelValue)
		const segment = props.segments.find((segment) => segment.value === modelValue)

		selected.value = segment
		bgWidth.value = items.value[index].getBoundingClientRect().width
		bgPosition.value = items.value[index].offsetLeft
	} else {
		selected.value = segments[0]

		bgWidth.value = items.value[0].getBoundingClientRect().width
		bgPosition.value = items.value[0].offsetLeft
	}
})

watch(selected, (segment) => {
	const valIndex = props.segments.findIndex((item) => item.name === segment?.name)
	bgPosition.value = items.value[valIndex].offsetLeft * 1

	emit('update:modelValue', segment?.value as Segemnt['value'])

	opacity.value = 'invisible opacity-0'

	setTimeout(() => {
		opacity.value = 'visible opacity-100'
	}, 250)
})
</script>

<template>
	<ul class="relative flex justify-center items-center space-x-6 rounded-xl bg-gray-200 dark:bg-dark-200 p-2">
		<div
			class="absolute dark:bg-purple-600 bg-purple-400 rounded-lg h-9 z-0 transition-all duration-300 ease-in-out py-1.5 text-center"
			:style="{ left: `${bgPosition}px`, width: `${bgWidth}px` }"
		>
			<span
				class="dark:text-light-100 text-white transition-opacity duration-75"
				:class="opacity"
			>
				{{ selected?.name }}
			</span>
		</div>

		<li
			v-for="segment in segments"
			:key="segment.name"
			class="w-full h-9"
		>
			<button
				ref="items"
				class="w-full py-1.5 title font-normal z-50"
				@click="selected = segment"
			>
				<span>{{ segment.name }}</span>
			</button>
		</li>
	</ul>
</template>

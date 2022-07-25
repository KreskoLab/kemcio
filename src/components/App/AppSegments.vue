<script setup lang="ts">
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
})
</script>

<template>
	<ul class="relative flex justify-center items-center space-x-6 rounded-xl bg-gray-200 dark:bg-dark-200 p-2 z-0">
		<span
			class="absolute h-full -z-1 transition-all duration-300 ease-in-out py-1.5 text-center"
			:style="{ left: `${bgPosition}px`, width: `${bgWidth}px` }"
		>
			<span class="flex w-full h-full dark:bg-purple-600 bg-purple-400 rounded-lg"></span>
		</span>

		<li
			v-for="segment in segments"
			:key="segment.name"
			class="flex items-center justify-center w-full h-6 sm:h-8"
		>
			<button
				ref="items"
				class="w-full title font-normal text-sm sm:text-base"
				@click="selected = segment"
			>
				<span>{{ segment.name }}</span>
			</button>
		</li>
	</ul>
</template>

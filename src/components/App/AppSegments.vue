<script setup lang="ts">
import { markRaw, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

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
const items = ref<HTMLElement[]>([])

const segment = reactive({
	position: 0,
	width: 0,
})

onMounted(() => {
	const { modelValue, segments } = markRaw(props)

	if (modelValue) {
		const index = props.segments.findIndex((segment) => segment.value === modelValue)

		selected.value = segments[index]

		updateSegmnet(index)
	} else {
		selected.value = segments[0]
		updateSegmnet(0)
	}

	window.addEventListener('resize', resizeHanlder)
})

onBeforeUnmount(() => window.removeEventListener('resize', resizeHanlder))

function resizeHanlder() {
	const index = props.segments.findIndex((item) => item.name === selected.value?.name)
	console.log(index, selected.value, props.modelValue)

	updateSegmnet(index)
}

function updateSegmnet(index: number) {
	segment.width = items.value[index].getBoundingClientRect().width
	segment.position = items.value[index].offsetLeft
}

watch(selected, (segment) => {
	const index = props.segments.findIndex((item) => item.name === segment?.name)

	updateSegmnet(index)
	emit('update:modelValue', segment?.value as Segemnt['value'])
})
</script>

<template>
	<ul class="relative flex justify-center items-center space-x-6 rounded-xl bg-gray-200 dark:bg-dark-200 p-2 z-0">
		<span
			class="absolute h-full -z-1 transition-all duration-300 ease-in-out py-1.5 text-center"
			:style="{ left: `${segment.position}px`, width: `${segment.width}px` }"
		>
			<span class="flex w-full h-full dark:bg-purple-600 bg-purple-400 rounded-lg"></span>
		</span>

		<li
			v-for="item in segments"
			:key="item.name"
			class="flex items-center justify-center w-full h-6 sm:h-8"
		>
			<button
				ref="items"
				class="w-full title font-normal text-sm sm:text-base"
				@click="selected = item"
			>
				<span>{{ item.name }}</span>
			</button>
		</li>
	</ul>
</template>

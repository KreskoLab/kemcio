<template>
	<div
		class="inline-block relative rounded-full w-12 h-6 transition-colors duration-300 delay-75 ease cursor-pointer"
		:class="background"
		@click="toggle()"
	>
		<span
			class="absolute inset-y-1 left-1 rounded-full dark:bg-light-100 w-4 h-4 transform duration-300 ease"
			:class="transition"
		/>
	</div>
</template>

<script
	setup
	lang="ts"
>
import { computed, ref } from 'vue'

const props = defineProps<{
	modelValue?: boolean
}>()

const emit = defineEmits<{
	(event: 'input', value: boolean): void
}>()

const state = ref<boolean>(props.modelValue || false)

const transition = computed(() => (state.value ? 'translate-x-6' : 'translate-x-0'))
const background = computed(() => (state.value ? 'dark:bg-purple-800' : 'dark:bg-dark-400'))

function toggle() {
	state.value = !state.value
	emit('input', state.value)
}
</script>

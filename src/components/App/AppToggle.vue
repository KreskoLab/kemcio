<template>
	<div
		class="inline-block relative rounded-full w-12 h-6 transition-colors duration-300 delay-75 ease cursor-pointer"
		:class="[background, { '!cursor-not-allowed': disabled }]"
		@click="!disabled ? toggle() : ''"
	>
		<span
			class="absolute inset-y-1 left-1 rounded-full bg-light-100 w-4 h-4 transform duration-300 ease"
			:class="transition"
		/>
	</div>
</template>

<script
	setup
	lang="ts"
>
import { computed } from 'vue'

const props = defineProps<{
	modelValue: boolean | string | number
	trueValue?: string
	falseValue?: string
	disabled?: boolean
}>()

const emit = defineEmits<{
	(event: 'input', value: boolean | string | number): void
}>()

const computedTrue = computed(() => (props.trueValue ? props.trueValue : true))
const computedFalse = computed(() => (props.falseValue ? props.falseValue : false))

const state = computed({
	get() {
		return props.modelValue || computedFalse.value
	},

	set(val) {
		emit('input', val)
	},
})

const transition = computed(() => (state.value === computedTrue.value ? 'translate-x-6' : 'translate-x-0'))
const background = computed(() =>
	state.value === computedTrue.value ? 'dark:bg-purple-800 bg-purple-600' : 'bg-dark-400'
)

function toggle() {
	if (state.value === computedTrue.value) state.value = computedFalse.value
	else state.value = computedTrue.value
}
</script>

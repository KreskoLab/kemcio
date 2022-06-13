<script
	setup
	lang="ts"
>
import { computed } from 'vue'

const props = defineProps<{
	modelValue: string
	disabled: boolean
}>()

const emit = defineEmits<{
	(event: 'input', value: string): void
}>()

const color = computed({
	get() {
		return `#${props.modelValue.slice(0, -4).toLowerCase()}`
	},

	set(val: string) {
		emit('input', val + '0000')
	},
})
</script>

<template>
	<div>
		<input
			type="color"
			:value="color"
			:disabled="disabled"
			:class="{ 'cursor-not-allowed': disabled }"
			@change="color = ($event.target as HTMLInputElement).value"
		/>
	</div>
</template>

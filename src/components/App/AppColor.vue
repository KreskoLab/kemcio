<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	modelValue: string
	disabled?: boolean
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
			class="appearance-none w-9 h-9 border-none bg-transparent"
			type="color"
			:value="color"
			:disabled="disabled"
			:class="{ 'cursor-not-allowed': disabled }"
			@change="color = ($event.target as HTMLInputElement).value"
		/>
	</div>
</template>

<style scoped>
input[type='color']::-webkit-color-swatch {
	border: 3px #fdfdfd solid;
	border-radius: 50%;
}
</style>

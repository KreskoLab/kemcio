<script setup lang="ts">
defineProps<{
	modelValue: number
	disabled: boolean
}>()

defineEmits<{
	(event: 'input', value: number): void
}>()
</script>

<template>
	<div>
		<input
			class="appearance-none w-full bg-dark-100 dark:bg-dark-400 h-1 rounded-full scrollbar-thumb-yellow-600"
			type="range"
			min="0"
			max="100"
			:value="modelValue"
			:disabled="disabled"
			:class="{ 'cursor-not-allowed': disabled }"
			@change="$emit('input', Number(($event.target as HTMLInputElement).value))"
		/>
	</div>
</template>

<style scoped>
input[type='range']::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	background-color: #fdfdfd;
	height: 16px;
	width: 16px;
	border-radius: 50%;
}

input[type='range']::-moz-range-thumb {
	border: none;
	background-color: #fdfdfd;
	height: 16px;
	width: 16px;
	border-radius: 50%;
}
</style>

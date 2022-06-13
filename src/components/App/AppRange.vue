<script
	setup
	lang="ts"
>
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

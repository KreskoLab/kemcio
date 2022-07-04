<script
	setup
	lang="ts"
>
defineProps<{
	label?: string
	placeholder?: string
	modelValue?: number
}>()

defineEmits<{
	(event: 'update:modelValue', value: number): void
}>()
</script>

<template>
	<div class="flex flex-col space-y-2">
		<label
			v-if="label"
			class="text-sm dark:text-gray-300"
		>
			{{ label }}
		</label>

		<input
			type="number"
			:placeholder="placeholder"
			:value="modelValue"
			class="w-full bg-white dark:bg-dark-400 text-slate-700 dark:text-gray-200 border-3 border-gray-200 dark:border-dark-200 transition duration-150 focus:(outline-none border-purple-300 dark:border-purple-300) py-2 px-3 text-sm rounded-md"
			@input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
		/>
	</div>
</template>

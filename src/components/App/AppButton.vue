<script setup lang="ts">
defineProps({
	size: {
		type: String,
		default: 'base',
		validator: (val: string) => sizes.includes(val),
	},
	variant: {
		type: String,
		default: 'base',
		validator: (val: string) => variants.includes(val),
	},
	transparent: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
})
</script>

<script lang="ts">
const sizes = ['sm', 'base', 'lg']
const variants = ['base', 'danger']
</script>

<template>
	<button
		class="w-full rounded-md text-light-50 transition duration-300"
		:class="[
			{
				'px-2 py-1': $slots.default && size === 'sm',
				'px-3 py-2': $slots.default && size === 'base',
				'px-6 py-4': $slots.default && size === 'lg',
				'bg-purple-500 ring-purple-400 dark:ring-offset-dark-600 hover:(bg-purple-500/90) focus:(ring-2 ring-offset-2 outline-none)':
					!disabled && !transparent && variant === 'base',
				'cursor-not-allowed': disabled,
				'text-slate-700 dark:text-light-100': transparent,
				'bg-red-500 ring-red-400 dark:ring-offset-dark-600 hover:(bg-red-500/90) focus:(ring-2 ring-offset-2 outline-none)':
					variant === 'danger',
			},
		]"
		:disabled="disabled"
	>
		<slot />
	</button>
</template>

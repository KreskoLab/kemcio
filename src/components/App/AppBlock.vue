<script setup lang="ts">
import { useIcon } from '@/composables/get-icon'

defineProps<{
	title: string
	icon: string
}>()
</script>

<template>
	<div
		class="flex flex-col space-y-2 rounded-lg dark:bg-dark-300 bg-gray-100 dark:text-light-400 py-3 px-4 cursor-pointer overflow-hidden"
	>
		<svg
			viewBox="0 0 24 24"
			class="w-6 h-6"
			v-html="useIcon(icon)"
		/>

		<span class="truncate">{{ title }}</span>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	steps: number
	step: number
}>()
</script>

<template>
	<ul class="flex space-x-6 justify-center">
		<li
			v-for="n in steps"
			:key="n"
			class="h-2 w-1/3 rounded-full border-2 border-purple-500"
			:class="{ 'bg-purple-500': n < step + 1 }"
		/>
	</ul>
</template>

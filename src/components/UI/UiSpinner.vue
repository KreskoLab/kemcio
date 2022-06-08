<template>
	<div class="flex justify-center items-center relative w-full h-42 rounded-lg bg-white">
		<span class="text-lg z-50 text-slate-700">{{ progress }} %</span>
		<div
			class="absolute bottom-0 w-full h-1 bg-purple-50 progress"
			:style="{ height: `${progress}%` }"
		/>
	</div>
</template>

<script
	setup
	lang="ts"
>
defineProps<{
	progress: number
}>()
</script>

<style scoped>
.progress {
	transition: height 0.5s ease-in-out;
}
</style>

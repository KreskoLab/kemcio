<script setup lang="ts">
defineProps<{
	value: string | number
}>()
</script>

<template>
	<Transition
		name="fade"
		mode="out-in"
		appear
	>
		<p
			:key="value"
			class="text-light-400 text-lg font-medium"
		>
			{{ value }}
		</p>
	</Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>

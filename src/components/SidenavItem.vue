<script
	setup
	lang="ts"
>
defineProps<{
	to?: string
}>()
</script>

<template>
	<router-link
		v-if="to"
		:to="to"
		class="link"
	>
		<slot />
	</router-link>

	<div
		v-else
		class="link"
	>
		<slot />
	</div>
</template>

<style scoped>
.link {
	@apply transition duration-200 
	hover:bg-light-300 dark:hover:bg-dark-200 hover:cursor-pointer
	text-gray-600 dark:text-gray-300 
	p-3 
	rounded-md;
}
</style>

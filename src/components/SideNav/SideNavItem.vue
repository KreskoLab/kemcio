<template>
	<li
		class="transition duration-200 hover:bg-light-300 dark:hover:bg-dark-200 text-gray-600 dark:text-gray-300 p-3 rounded-md"
	>
		<router-link
			v-if="to"
			:to="to"
		>
			<slot />
		</router-link>

		<div v-else>
			<slot />
		</div>
	</li>
</template>

<script
	setup
	lang="ts"
>
defineProps<{
	to?: string
}>()
</script>

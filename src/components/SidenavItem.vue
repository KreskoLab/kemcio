<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
	to?: string
}>()

const route = useRoute()

const active = computed(() => {
	if (route.matched.length > 1 && (props.to?.length as number) > 1) {
		return route.path.includes(props.to as string) ? 'bg-light-300 dark:bg-dark-200' : ''
	} else return route.path === props.to ? 'bg-light-300 dark:bg-dark-200' : ''
})
</script>

<template>
	<router-link
		v-if="to"
		:to="to"
		class="link"
		:class="active"
	>
		<slot />
	</router-link>

	<div
		v-else
		class="link"
		:class="active"
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

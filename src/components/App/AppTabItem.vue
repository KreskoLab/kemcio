<script
	setup
	lang="ts"
>
import { computed } from '@vue/reactivity'
import { inject, Ref } from 'vue'

const props = defineProps<{
	label: string
}>()

const activeTab = inject<Ref<string>>('activeTab')
const active = computed(() => props.label === activeTab?.value)
</script>

<template>
	<div v-show="active">
		<slot />
	</div>
</template>

<script setup lang="ts">
import type { ValidConnectionFunc } from '@braks/vue-flow'
import { Handle, Position } from '@braks/vue-flow'

defineProps<{
	type: 'target' | 'source'
	positon: Position
	id?: string
	isValidConnection?: ValidConnectionFunc
}>()
</script>

<template>
	<Handle
		:id="id"
		:type="type"
		class="bg-dark-200 dark:bg-light-50 w-3 h-3"
		:class="[{ 'inset-y-1/2 -right-2': type === 'source' }, { 'inset-y-1/2 -left-2': type === 'target' }]"
		:position="positon"
		:is-valid-connection="isValidConnection"
	/>
</template>

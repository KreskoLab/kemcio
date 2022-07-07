<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const emit = defineEmits<{
	(event: 'change', val: boolean): void
}>()

const active = ref<boolean>(false)
const dropdown = ref<HTMLElement | null>(null)

function toggle(val: boolean) {
	active.value = val
	emit('change', active.value)
}

onClickOutside(dropdown, () => toggle(false))
</script>

<template>
	<div class="relative p-1">
		<button
			ref="dropdown"
			@click="toggle(!active)"
		>
			<slot name="header" />
		</button>

		<ul
			v-if="active"
			class="absolute right-0 form !rounded-md z-50 space-y-1 p-3 mt-1 shadow-md"
		>
			<slot />
		</ul>
	</div>
</template>

<script setup lang="ts">
import AppBlock from '@/components/App/AppBlock.vue'
import type { Block } from '@/models'
import { useBlocks } from '@/store/blocks'
import { computed } from '@vue/reactivity'

const store = useBlocks()
store.setBlocks()

const systemBlocks = computed(() => store.getSystemBlocks)
const devicesBlocks = computed(() => store.getDevicesBlocks)

function startDrag(event: DragEvent, block: Block) {
	event.dataTransfer?.setData('block', block.slug)
}
</script>

<template>
	<div
		class="h-full w-sm overflow-y-scroll px-4 py-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-light-400 dark:scrollbar-thumb-light-800 dark:scrollbar-track-dark-600"
	>
		<h2 class="title text-xl">Компонети</h2>

		<div class="my-6">
			<div class="flex items-center space-x-2">
				<div class="w-3 h-3 rounded-full bg-purple-300" />
				<h2 class="font-medium dark:text-gray-300 text-slate-900">Основні</h2>
			</div>

			<div class="grid grid-cols-2 gap-2 my-3">
				<AppBlock
					v-for="block in systemBlocks"
					:key="block.title"
					:icon="block.icon"
					:title="block.title"
					draggable="true"
					@dragstart="startDrag($event, block)"
				/>
			</div>
		</div>

		<div class="my-6">
			<div class="flex items-center space-x-2">
				<div class="w-3 h-3 rounded-full bg-amber-300" />
				<h2 class="font-medium dark:text-gray-300 text-slate-900">Пристрої</h2>
			</div>

			<div class="grid grid-cols-2 gap-2 my-3">
				<AppBlock
					v-for="block in devicesBlocks"
					:key="block.title"
					:icon="block.icon"
					:title="block.title"
					draggable="true"
					@dragstart="startDrag($event, block)"
				/>
			</div>
		</div>
	</div>
</template>

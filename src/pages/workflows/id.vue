<script setup lang="ts">
import TheSidebar from '@/components/TheSidebar.vue'
import AppButton from '@/components/App/AppButton.vue'
import { VueFlow, BackgroundVariant, Background, useVueFlow, Node, EdgeMouseEvent } from '@braks/vue-flow'
import { NODES } from '@/enums/nodes'
import { nanoid } from 'nanoid'
import { onBeforeUnmount, onMounted } from 'vue'
import { useBlocks } from '@/store/blocks'
import { useRoute } from 'vue-router'
import { Workflow } from '@/models/workflow'
import { computed } from '@vue/reactivity'
import { nodesBlocks, useNodeComponent } from '@/composables/nodes'
import type { NodesKeys } from '@/composables/nodes'

const store = useBlocks()

const workflowId = useRoute().params.id as string
const workflow = computed<Workflow>(() => store.workflow)

await store.setDevicesElements()
await store.getWorkflow(workflowId)

const { onConnect, addNodes, addEdges, getNode, removeEdges, getNodes, getEdges, setState } = useVueFlow({
	id: 'main',
})

onMounted(() => {
	setState({ nodes: workflow.value?.nodes, edges: workflow.value?.edges })
})

onBeforeUnmount(() => {
	store.clear()
})

onConnect((params) => {
	addEdges([
		{
			...params,
			class:
				'children:(stroke-5 stroke-gray-400 dark:stroke-light-600 transition duration-150 hover:stroke-red-300 cursor-pointer)',
		},
	])
})

async function saveBlocks() {
	if (getNode.value(NODES.TRIGGER)) {
		const nodes = getNodes.value
		const edges = getEdges.value

		store.setNodes(nodes)
		store.setEdges(edges)

		await store.updateWorkflow(workflowId)
	} else {
		console.log('Need Trigger block')
	}
}

function onEdgeClick(event: EdgeMouseEvent) {
	removeEdges([event.edge.id])
}

function onDrop(event: DragEvent) {
	const block = event.dataTransfer?.getData('block') as NodesKeys
	const component = nodesBlocks[block].component

	if (nodesBlocks[block] === nodesBlocks.TRIGGER) {
		const nodeExist = getNode.value(block)

		if (!nodeExist) {
			const node: Node = {
				id: component,
				type: 'custom',
				position: { x: event.offsetX, y: event.offsetY },
				template: useNodeComponent(component),
			}

			addNodes([node])
		}
	} else {
		const node: Node = {
			id: component + '-' + nanoid(),
			type: 'custom',
			position: { x: event.offsetX, y: event.offsetY },
			template: useNodeComponent(component),
			data: nodesBlocks[block].data,
			isValidTargetPos: nodesBlocks[block].isValidTargetPos,
		}

		addNodes([node])
	}
}
</script>

<template>
	<div class="flex lg:pl-24 page h-full">
		<AppButton
			class="flex items-center space-x-2 absolute top-8 right-4 w-36 z-50"
			@click="saveBlocks()"
		>
			<i-lucide-save />
			<span>Зберегти</span>
		</AppButton>

		<TheSidebar />

		<VueFlow
			id="main"
			:default-zoom="1"
			:min-zoom="1"
			:max-zoom="1"
			@drop="onDrop($event)"
			@dragover.prevent
			@dragenter.prevent
			@edge-click="onEdgeClick"
		>
			<Background :variant="BackgroundVariant.Dots" />
		</VueFlow>
	</div>
</template>

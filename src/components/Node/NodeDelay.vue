<script setup lang="ts">
import Node from '@/components/Node/Node.vue'
import AppInput from '@/components/App/AppInput.vue'
import NodeHandler from '@/components/Node/NodeHandler.vue'
import { Position } from '@braks/vue-flow'
import { onMounted, ref, watch } from 'vue'
import { updateNodeData, updateNodeState } from '@/composables/update-node'

const baseNode = ref<InstanceType<typeof Node> | null>(null)
const id = ref<string>('')

const value = ref('')

onMounted(() => {
	id.value = baseNode.value?.id as string
	updateNodeState(value, id.value)
})

watch(value, () => updateNodeData(id.value, value.value as string))
</script>

<template>
	<Node
		ref="baseNode"
		name="Чекати"
		icon="clock-3"
	>
		<template #handle>
			<NodeHandler
				:positon="Position.Left"
				:type="'target'"
			/>

			<NodeHandler
				:positon="Position.Right"
				:type="'source'"
			/>
		</template>

		<AppInput
			v-model="value"
			placeholder="міллісекунди"
		/>
	</Node>
</template>

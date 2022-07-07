<script lang="ts">
export default {
	inheritAttrs: false,
}
</script>

<script setup lang="ts">
import Node from '@/components/Node/Node.vue'
import AppInput from '@/components/App/AppInput.vue'
import type { ValidConnectionFunc } from '@braks/vue-flow'
import NodeHandler from '@/components/Node/NodeHandler.vue'
import { Position } from '@braks/vue-flow'
import { onMounted, ref, useAttrs, watch } from 'vue'
import { updateNodeState, updateNodeData } from '@/composables/update-node'

const attrs = useAttrs()
const baseNode = ref<InstanceType<typeof Node> | null>(null)

const variable = ref<string>('')
const id = ref<string>('')

onMounted(() => {
	id.value = baseNode.value?.id as string
	updateNodeState(variable, id.value)
})

watch(variable, () => updateNodeData(id.value, variable.value as string))
</script>

<template>
	<Node ref="baseNode">
		<template #handle>
			<NodeHandler
				:positon="Position.Right"
				:type="'source'"
				:is-valid-connection="(attrs['is-valid-target-pos'] as ValidConnectionFunc)"
			/>
		</template>

		<AppInput
			v-model="variable"
			placeholder="введіть"
		/>
	</Node>
</template>

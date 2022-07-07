import { GraphNode, useVueFlow } from '@braks/vue-flow'
import { isRef, Ref } from 'vue'
const { getNodes } = useVueFlow({ id: 'main' })

export const updateNodeData = (id: string, value: string | number | object | boolean) => {
	const node = getNodes.value.find((node) => node.id == id) as GraphNode
	if (node) node.data = value
}

export const updateNodeState = (state: Ref<string> | object, id: string) => {
	const node = getNodes.value.find((node) => node.id == id) as GraphNode

	if (isRef(state)) {
		if (typeof node?.data === 'string') state.value = node?.data
	} else {
		Object.assign(state, node?.data)
	}
}

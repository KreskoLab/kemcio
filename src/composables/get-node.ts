import { nodesBlocks } from '@/composables/nodes'
import { NodeProps } from '@braks/vue-flow'
import { defineAsyncComponent, markRaw } from 'vue'

type Keys = keyof typeof nodesBlocks
type Values = typeof nodesBlocks[Keys]['component']

export const useNode = (node: Values) => {
	const component = defineAsyncComponent(() => import(`../components/Node/${node}.vue`))
	return markRaw(component) as unknown as NodeProps
}

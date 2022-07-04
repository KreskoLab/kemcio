import { GraphEdge, GraphNode } from '@braks/vue-flow'

export type Workflow = {
	_id: string
	name: string
	nodes?: GraphNode[] | undefined
	edges?: GraphEdge[] | undefined
	createdAt: Date
}

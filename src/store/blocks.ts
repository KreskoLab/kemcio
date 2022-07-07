import axios from 'axios'
import { Block, Device, Workflow } from '@/models'
import { defineStore } from 'pinia'
import { GraphEdge, GraphNode } from '@braks/vue-flow'
import { nodesBlocks, useNodeComponent, useNodeValidation } from '@/composables/nodes'
import type { NodesValues } from '@/composables/nodes'

interface DeviceElements {
	devices: Pick<Device, '_id' | 'name'>[]
	name: string
	element: string
}

interface WorkflowsResponse extends Workflow {
	rawEdges: string
	rawNodes: string
}

export const useBlocks = defineStore('blocks', {
	state: () => {
		return {
			workflow: {} as Workflow,
			nodes: [] as GraphNode[],
			edges: [] as GraphEdge[],
			devicesElements: [] as DeviceElements[],
			blocks: [] as Block[],
		}
	},

	actions: {
		setBlocks() {
			this.blocks = Object.entries(nodesBlocks).map(([key, val]) => {
				return {
					title: val.data.name,
					icon: val.data.icon,
					type: val.type,
					slug: key,
				}
			})
		},

		async setDevicesElements(): Promise<void> {
			this.devicesElements = []

			try {
				const res = await axios
					.get<DeviceElements[]>(`${import.meta.env.VITE_API}/devices/elements`)
					.then((res) => res.data)

				this.devicesElements.push(...res)
			} catch (error) {}
		},

		async updateWorkflow(id: string) {
			await axios
				.put(`${import.meta.env.VITE_API}/workflows/${id}`, {
					rawNodes: JSON.stringify(this.nodes),
					rawEdges: JSON.stringify(this.edges),
					nodes: this.nodes.map(({ id, data }) => ({ id, data })),
					edges: this.edges.map(({ source, target, sourceHandle, targetHandle }) => ({
						source,
						target,
						sourceHandle,
						targetHandle,
					})),
				})
				.then(() => {
					this.nodes = []
					this.edges = []
				})
		},

		async getWorkflow(id: string) {
			await axios.get<WorkflowsResponse>(`${import.meta.env.VITE_API}/workflows/${id}`).then((res) => {
				this.workflow = {
					_id: res.data._id,
					name: res.data.name,
					createdAt: res.data.createdAt,
					pause: res.data.pause,
					nodes: res.data.rawNodes ? (JSON.parse(res.data.rawNodes) as GraphNode[]) : undefined,
					edges: res.data.rawEdges ? (JSON.parse(res.data.rawEdges) as GraphEdge[]) : undefined,
				}

				if (this.workflow.nodes) {
					this.workflow.nodes = this.workflow.nodes.map((node) => ({
						...node,
						template: useNodeComponent(node.id.split('-')[0] as NodesValues),
						isValidTargetPos: useNodeValidation(node.id.split('-')[0] as NodesValues),
					}))
				}
			})
		},

		setNodes(nodes: GraphNode[]): void {
			this.nodes = nodes
		},

		setEdges(edges: GraphEdge[]): void {
			this.edges = edges
		},

		clear(): void {
			this.nodes = []
			this.edges = []
			this.workflow = {} as Workflow
		},
	},

	getters: {
		getDevicesBlocks: (state) => {
			return state.blocks.filter((block) => block.type === 'device')
		},

		getSystemBlocks: (state) => {
			return state.blocks.filter((block) => block.type === 'system')
		},

		getDevicesByElement: (state) => {
			return (element: string): Pick<Device, '_id' | 'name'>[] => {
				return state.devicesElements.find((item) => item.element === element)?.devices || []
			}
		},
	},
})

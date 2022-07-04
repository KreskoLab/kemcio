import { Connection, NodeProps } from '@braks/vue-flow'
import { defineAsyncComponent, markRaw } from 'vue'

export const nodesBlocks = {
	TRIGGER: {
		type: 'system',
		component: 'NodeTrigger',
		element: 'TRIGGER',
		isValidTargetPos: undefined,
		data: { icon: 'zap', name: 'Тріггер', element: 'TRIGGER' },
	},

	IF: {
		type: 'system',
		component: 'NodeIf',
		element: 'IF',
		isValidTargetPos: undefined,
		data: { icon: 'option', name: 'Умова', element: 'IF' },
	},

	DELAY: {
		type: 'system',
		component: 'NodeDelay',
		element: 'DELAY',
		isValidTargetPos: undefined,
		data: { icon: 'clock-3', name: 'Чекати', element: 'DELAY' },
	},

	VARIABLE: {
		type: 'system',
		component: 'NodeVariable',
		element: 'VARIABLE',
		isValidTargetPos: (connection: Connection) =>
			connection.target.includes(nodesBlocks.EQUEL.component) ||
			connection.target.includes(nodesBlocks.GT.component) ||
			connection.target.includes(nodesBlocks.LT.component),
		data: { icon: 'box', name: 'Змінна', element: 'VARIABLE' },
	},

	EQUEL: {
		type: 'system',
		component: 'NodeEqual',
		element: 'EQUEL',
		isValidTargetPos: (connection: Connection) =>
			connection.target.includes(nodesBlocks.IF.component) && connection.targetHandle === 'condition',
		data: { icon: 'equal', name: 'Дорівнює', element: 'EQUEL' },
	},

	GT: {
		type: 'system',
		component: 'NodeGt',
		element: 'GT',
		isValidTargetPos: (connection: Connection) =>
			connection.target.includes(nodesBlocks.IF.component) && connection.targetHandle === 'condition',
		data: { icon: 'chevron-right', name: 'Більше', element: 'GT' },
	},

	LT: {
		type: 'system',
		component: 'NodeLt',
		element: 'LT',
		isValidTargetPos: (connection: Connection) =>
			connection.target.includes(nodesBlocks.IF.component) && connection.targetHandle === 'condition',
		data: { icon: 'chevron-left', name: 'Менше', element: 'LT' },
	},

	POWER: {
		type: 'device',
		component: 'NodePower',
		element: 'POWER',
		isValidTargetPos: undefined,
		data: { icon: 'settings-2', name: 'Стан', element: 'POWER' },
	},

	TEMPERATURE: {
		type: 'device',
		component: 'NodeData',
		element: 'TEMPERATURE',
		isValidTargetPos: undefined,
		data: { icon: 'thermometer-sun', name: 'Температура', element: 'TEMPERATURE' },
	},

	HUMIDITY: {
		type: 'device',
		component: 'NodeData',
		element: 'HUMIDITY',
		isValidTargetPos: undefined,
		data: { icon: 'droplet', name: 'Вологість', element: 'HUMIDITY' },
	},

	Color: {
		type: 'device',
		component: 'NodeData',
		element: 'Color',
		isValidTargetPos: undefined,
		data: { icon: 'palette', name: 'Колір', element: 'Color' },
	},

	Dimmer: {
		type: 'device',
		component: 'NodeData',
		element: 'Dimmer',
		isValidTargetPos: undefined,
		data: { icon: 'sun', name: 'Яркість', element: 'Dimmer' },
	},
} as const

export type NodesKeys = keyof typeof nodesBlocks
export type NodesValues = typeof nodesBlocks[NodesKeys]['component']

export const useNodeComponent = (node: NodesValues) => {
	const component = defineAsyncComponent(() => import(`../components/Node/${node}.vue`))
	return markRaw(component) as unknown as NodeProps
}

export const useNodeValidation = (node: NodesValues) => {
	return Object.entries(nodesBlocks).find(([key, val]) => val.component === node)?.[1].isValidTargetPos
}

export const getNodeById = (computedId: string) => {
	const id = computedId.split('-')[0]
	return Object.entries(nodesBlocks).find(([key, val]) => val.component === id)?.[1].data
}

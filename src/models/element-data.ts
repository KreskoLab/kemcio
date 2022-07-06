export interface ElementData {
	value: number
	date: string
}

export type ElementsData = {
	[key: string]: ElementData[]
}

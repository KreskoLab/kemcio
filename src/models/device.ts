import { DeviceElement } from './device-element'

export type DeviceType = 'switch' | 'bulb' | 'sensor'

export type Device = {
	_id: string
	name: string
	type: DeviceType
	vendor: string
	device: string
	online: boolean
	gpio?: string
	pin?: string
	interval?: number
	elements: DeviceElement[]
}

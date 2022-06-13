import { DeviceElement } from './device-element'

export type Device = {
	_id: string
	name: string
	topic: string
	type: string
	vendor: string
	device: string
	online: boolean
	elements: DeviceElement[]
}

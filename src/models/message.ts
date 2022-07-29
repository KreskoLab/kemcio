import { Device } from './device'
import { DeviceElement } from './device-element'

export type Message = (Pick<Device, 'online'> | DeviceElement) & { id: string }

import { VendorDevice } from './vendor-device'

export type Vendor = {
	name: string
	slug: string
	devices: VendorDevice[]
}

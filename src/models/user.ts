import { ROLE } from '@/enums/role'

export type User = {
	_id: string
	name: string
	login: string
	role: ROLE
}

import icons from '@iconify-json/lucide/icons.json'

export const useIcon = (icon: string) => {
	const s = icons.icons?.[icon as keyof typeof icons.icons]
	if (s?.body) return s.body
	else return null
}

/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
	safelist:
		'hover:text-yellow-400 hover:text-sky-400 hover:text-green-400 hover:text-indigo-400 hover:text-red-400 bg-indigo-400 bg-red-400 bg-yellow-400 bg-sky-400 bg-green-400',
	plugins: [require('@windicss/plugin-animations')()],
})

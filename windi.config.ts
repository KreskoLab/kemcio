/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
	shortcuts: {
		'page': 'dark:bg-dark-800 bg-purple-50/20',
		'title': 'font-medium text-slate-700 dark:text-gray-200',
		'subtitle': 'text-slate-900 dark:text-gray-400',
		'form': 'dark:bg-dark-400 bg-slate-50 border border-gray-100 dark:border-dark-200 rounded-xl'
	},
	plugins: [require('@windicss/plugin-animations')()],
})

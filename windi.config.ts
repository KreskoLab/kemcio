/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
	shortcuts: {
		'page': 'dark:bg-dark-800 bg-purple-50/20',
		'padding': 'pt-22 pb-16 px-6 sm:(pl-28 pt-26) lg:(pl-32 pt-8 pb-4)',
		'title': 'font-medium text-slate-700 dark:text-gray-200',
		'subtitle': 'text-slate-900 dark:text-gray-400 text-sm',
		'form': 'dark:bg-dark-400 bg-slate-50 border border-gray-200 dark:border-dark-200 rounded-xl'
	},
	plugins: [require('@windicss/plugin-animations')(), require('@windicss/plugin-scrollbar')],
})

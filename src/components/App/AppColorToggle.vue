<script setup lang="ts">
import { useMain } from '@/store/main'
import { onMounted, ref } from 'vue'

type Theme = 'light' | 'dark'

const color = ref<Theme>('light')
const store = useMain()

function toggle(theme: Theme) {
	window.localStorage.setItem('colorMode', theme)

	store.setTheme(theme)

	document.documentElement.classList.remove(color.value)
	document.documentElement.classList.add(theme)

	color.value = theme
}

onMounted(() => {
	const localColor = window.localStorage.getItem('colorMode') as Theme

	if (!localColor) {
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			window.localStorage.setItem('colorMode', 'dark')
			document.documentElement.classList.add('dark')
			color.value = 'dark'
		} else {
			window.localStorage.setItem('colorMode', 'light')
			document.documentElement.classList.add('light')
			color.value = 'light'
		}
	} else {
		color.value = localColor
		document.documentElement.classList.add(localColor)
	}

	store.setTheme(color.value)
})
</script>

<template>
	<div class="cursor-pointer dark:text-gray-300 text-gray-600">
		<i-lucide-sun
			v-if="color === 'light'"
			style="font-size: 1.2em"
			@click="toggle('dark')"
		/>

		<i-lucide-moon
			v-else
			style="font-size: 1.2em"
			@click="toggle('light')"
		/>
	</div>
</template>

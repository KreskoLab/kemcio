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

<script
	setup
	lang="ts"
>
import { onMounted, ref } from 'vue'

const color = ref('')

function toggle(mode: string) {
	window.localStorage.setItem('colorMode', mode)
	document.documentElement.classList.remove(color.value)
	document.documentElement.classList.add(mode)

	color.value = mode
}

onMounted(() => {
	const localColor = window.localStorage.getItem('colorMode')

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
})
</script>

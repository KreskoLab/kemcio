<script
	setup
	lang="ts"
>
import SideNav from './components/SideNav/SideNav.vue'
</script>

<template>
	<div class="flex h-screen w-full">
		<RouterView name="SideNav" />

		<main class="h-full w-full">
			<RouterView />
		</main>
	</div>
</template>

<style>
@import '@/assets/main.css';
</style>

<template>
	<div class="flex flex-col-reverse lg:flex-row page">
		<RouterView name="Sidenav" />

		<main class="w-full h-screen lg:(min-h-screen)">
			<Suspense>
				<RouterView />
			</Suspense>
		</main>

		<RouterView name="Navbar" />
	</div>
</template>

<style>
@import '@/assets/main.css';
</style>

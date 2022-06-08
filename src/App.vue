<template>
	<div class="flex flex-col-reverse lg:flex-row h-screen w-full">
		<RouterView name="SideNav" />

		<main class="h-full w-full">
			<Suspense>
				<RouterView />
			</Suspense>
		</main>
	</div>
</template>

<style>
@import '@/assets/main.css';
</style>

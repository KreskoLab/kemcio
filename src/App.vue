<template>
	<div class="flex flex-col-reverse lg:flex-row page">
		<RouterView name="Sidenav" />

		<main
			class="page w-full h-screen lg:(min-h-screen) scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-300 scrollbar-track-transparent scrollbar-thumb-rounded-lg"
		>
			<RouterView v-slot="{ Component }">
				<template v-if="Component">
					<Transition name="fade">
						<Suspense>
							<component :is="Component" />

							<template #fallback>
								<div class="flex justify-center items-center padding w-full h-full">
									<span class="animate-ping h-16 w-16 rounded-full bg-purple-600/60" />
								</div>
							</template>
						</Suspense>
					</Transition>
				</template>
			</RouterView>
		</main>

		<RouterView name="Navbar" />
	</div>
</template>

<style>
@import '@/assets/main.css';

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>

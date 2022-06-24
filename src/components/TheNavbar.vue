<template>
	<header class="page fixed top-0 flex justify-between items-center py-4 px-6 h-16 w-full lg:hidden">
		<router-link
			class=""
			to="/"
		>
			<img
				src="@/assets/logo.svg"
				class="w-8 h-8"
			/>
		</router-link>

		<AppColorToggle />
	</header>
</template>

<style scoped>
header {
	@apply dark:bg-dark-800/90 bg-white/90
  border-b dark:border-dark-200 border-gray-200 z-50
  backdrop-filter backdrop-blur;
}
</style>

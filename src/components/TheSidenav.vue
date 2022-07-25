<script setup lang="ts">
import SidenavItem from '@/components/SidenavItem.vue'
import AppColorToggle from '@/components/App/AppColorToggle.vue'
import { useUser } from '@/store/user'

const userStore = useUser()
</script>

<template>
	<nav class="fixed bottom-0 w-full h-16 py-2 px-6 sm:(pt-8 pb-12 px-2 w-20 h-full) z-50">
		<router-link
			class="hidden sm:(flex justify-center)"
			to="/"
		>
			<img
				src="@/assets/logo.svg"
				class="w-8 h-8"
			/>
		</router-link>

		<div class="flex flex-row justify-between sm:(flex-col justify-start py-8) items-center gap-y-6 h-full">
			<SidenavItem to="/">
				<i-lucide-cpu class="text-2xl" />
			</SidenavItem>

			<SidenavItem to="/workflows">
				<i-lucide-function-square class="text-2xl" />
			</SidenavItem>

			<SidenavItem to="/settings/user">
				<i-lucide-wrench class="text-2xl" />
			</SidenavItem>

			<SidenavItem
				class="lg:(block mt-auto)"
				@click="userStore.logOut()"
			>
				<i-lucide-log-out class="text-2xl" />
			</SidenavItem>

			<div class="hidden mt-2 lg:(block)">
				<AppColorToggle />
			</div>
		</div>
	</nav>
</template>

<style scoped>
nav {
	@apply dark:bg-dark-800 bg-white
	 border-t-1 border-t-gray-200 dark:border-t-dark-200
	sm:(border-r-3 border-t-0 border-r-gray-100 dark:border-r-dark-200);
}
</style>

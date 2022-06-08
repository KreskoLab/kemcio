<template>
	<nav class="bg-white dark:bg-dark-800 lg:( pt-4 pb-12 px-2 w-20)">
		<ul class="flex flex-row justify-between lg:(flex-col justify-start) items-center gap-y-6 h-full">
			<SideNavItem to="/devices">
				<i-lucide-cpu style="font-size: 1.4em" />
			</SideNavItem>

			<SideNavItem to="/rooms">
				<i-lucide-layout-grid style="font-size: 1.4em" />
			</SideNavItem>

			<SideNavItem to="/scripts">
				<i-lucide-flask-conical style="font-size: 1.4em" />
			</SideNavItem>

			<SideNavItem to="/settings">
				<i-lucide-wrench style="font-size: 1.4em" />
			</SideNavItem>

			<SideNavItem>
				<i-lucide-log-out style="font-size: 1.4em" />
			</SideNavItem>

			<div class="lg:mt-auto">
				<AppColorToggle />
			</div>
		</ul>
	</nav>
</template>

<script
	setup
	lang="ts"
>
import SideNavItem from '../SideNav/SideNavItem.vue'
import AppColorToggle from '@/components/App/AppColorToggle.vue'
</script>

<style scoped>
nav {
	@apply border-t-3 border-t-gray-100 dark:border-t-dark-200
	lg:(border-r-3 border-t-0 border-r-gray-100 dark:border-r-dark-200);
}
</style>

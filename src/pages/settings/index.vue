<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useIcon } from '@/composables/get-icon'

const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
	if (route.name === 'settings') {
		router.push('/settings/user')
	}
})

const list = ref([
	{
		name: 'Аккаунт',
		link: '/settings/user',
		icon: 'user',
	},
	{
		name: 'Користувачі',
		link: '/settings/users',
		icon: 'users',
	},
])
</script>

<template>
	<div class="page pt-22 pb-32 px-6 sm:(pl-28 pt-26) lg:(pl-32 pt-16 pb-4) h-full min-w-[360px] overflow-y-auto">
		<div class="flex flex-col space-y-6 md:(flex-row item space-x-28 space-y-0)">
			<ul
				class="bg-slate-50 dark:bg-dark-400 border border-gray-100 dark:border-dark-200 rounded-md px-2 py-3 space-y-2 text-gray-500 dark:text-gray-400 w-full h-max md:(w-52)"
			>
				<li
					v-for="item in list"
					:key="item.name"
					class="flex items-center space-x-3 hover:bg-light-600 dark:hover:bg-dark-200 rounded-md py-1.5 px-3 cursor-pointer"
					:class="{ 'dark:text-light-200 text-purple-500': $route.path === item.link }"
				>
					<router-link :to="item.link">
						<svg
							viewBox="0 0 24 24"
							class="h-5 w-5"
							v-html="useIcon(item.icon)"
						/>
						<span>{{ item.name }}</span>
					</router-link>
				</li>
			</ul>

			<div class="form border border-gray-100 dark:border-dark-200 md:(w-2xl px-8) px-4 pt-6 pb-8">
				<router-view />
			</div>
		</div>
	</div>
</template>

<style scoped>
a {
	@apply flex items-center space-x-3 w-full;
}
</style>

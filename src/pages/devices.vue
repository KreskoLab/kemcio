<template>
	<div class="dark:bg-dark-800 bg-purple-50/20 py-8 px-12 flex flex-col h-full">
		<div class="flex items-center space-x-5">
			<h1 class="font-medium text-slate-700 dark:text-gray-200 text-3xl">Пристрої</h1>

			<router-link to="/devices/new">
				<AppButton size="sm">
					<i-lucide-plus />
				</AppButton>
			</router-link>
		</div>

		<div class="my-12">
			<AppCard />
		</div>
	</div>
</template>

<script
	setup
	lang="ts"
>
import AppButton from '@/components/App/AppButton.vue'
import AppToggle from '@/components/App/AppToggle.vue'
import AppCard from '@/components/App/AppCard.vue'
</script>

<template>
	<div class="dark:bg-dark-800 bg-purple-50/20 py-4 lg:(py-16 px-42) h-full">
		<div class="flex flex-col space-y-6 lg:(flex-row item space-x-32 space-y-0)">
			<ul
				class="bg-slate-50 dark:bg-dark-400 border border-gray-100 dark:border-dark-200 rounded-md px-2 py-3 space-y-2 text-gray-600 dark:text-gray-300 w-full h-max lg:(w-42)"
			>
				<li
					class="flex items-center space-x-3 hover:bg-light-600 dark:hover:bg-dark-200 rounded-md py-1.5 px-3 cursor-pointer"
				>
					<i-lucide-user />
					<span>Аккаунт</span>
				</li>

				<li
					class="flex items-center space-x-3 hover:bg-light-600 dark:hover:bg-dark-200 rounded-md py-1.5 px-3 cursor-pointer"
				>
					<i-lucide-box />
					<span>Система</span>
				</li>
			</ul>

			<div class="form border border-gray-100 dark:border-dark-200 lg:(w-2xl) px-8 pt-6 pb-8">
				<h1 class="font-medium text-slate-700 dark:text-gray-200 lg:text-xl">Налаштування користувача</h1>

				<form
					class="flex flex-col space-y-3 mt-6"
					@submit.prevent
				>
					<AppInput
						v-model="name"
						label="Ім'я"
					/>

					<AppInput
						v-model="login"
						label="Логін"
					/>

					<AppInput
						v-model="password"
						password
						label="Пароль"
					/>

					<AppButton>Зберегти</AppButton>
				</form>
			</div>
		</div>
	</div>
</template>

<script
	setup
	lang="ts"
>
import AppButton from '@/components/App/AppButton.vue'
import AppInput from '@/components/App/AppInput.vue'
import { useUser } from '@/store/user'

const userStore = useUser()

const { name, login } = userStore
const password = ''
</script>

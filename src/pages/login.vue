<template>
	<div class="flex justify-center bg-gradient-to-br from-slate-900 via-slate-600 to-slate-900 h-full w-full">
		<UIToast ref="toast" />

		<form
			class="flex flex-col absolute top-1/5 min-w-[320px] w-full px-6 py-4 pb-12 sm:(w-1/3 px-16 pt-2 pb-14) bg-light-200 rounded-xl transition-all duration-300 ease-in-out"
			@submit.prevent
		>
			<div class="mx-auto">
				<LogoType />
			</div>

			<div class="text-base text-gray-600">
				<AppInput
					v-model="login"
					label="Логін"
					placeholder="Ваш логін"
					:error="v$.login.$errors[0] ? true : false"
					:error-message="v$.login.$errors[0]?.$message"
				>
					<template #icon>
						<i-lucide-user />
					</template>
				</AppInput>
			</div>

			<div class="mt-4 text-base text-gray-600">
				<AppInput
					v-model="password"
					label="Пароль"
					placeholder="Ваш пароль"
					password
					:error="v$.password.$errors[0] ? true : false"
					:error-message="v$.password.$errors[0]?.$message"
				>
					<template #icon>
						<i-lucide-key />
					</template>
				</AppInput>
			</div>

			<div class="w-full mt-6">
				<AppButton @click="logIn()">Увійти</AppButton>
			</div>
		</form>
	</div>
</template>

<script
	setup
	lang="ts"
>
import AppInput from '@/components/App/AppInput.vue'
import LogoType from '@/components/LogoType.vue'
import AppButton from '@/components/App/AppButton.vue'
import UIToast from '@/components/UI/UIToast.vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { ref, computed } from 'vue'
import { useUser } from '@/store/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const login = ref<string>('')
const password = ref<string>('')

const toast = ref<InstanceType<typeof UIToast>>()

const passwordMinLength = ref(6)

const rules = computed(() => ({
	login: {
		required: helpers.withMessage('Введіть логін', required),
	},
	password: {
		required: helpers.withMessage('Введіть пароль', required),
		minLength: minLength(passwordMinLength.value),
	},
}))

const v$ = useVuelidate(rules, { login, password })

const userStore = useUser()

async function logIn() {
	v$.value.$validate()

	if (!v$.value.$error) {
		const res = await userStore.logIn(login.value, password.value)

		if (res === 'ok') {
			router.push('/devices')
		} else {
			toast.value?.err(res)
		}
	}
}
</script>

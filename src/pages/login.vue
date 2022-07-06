<script
	setup
	lang="ts"
>
import AppInput from '@/components/App/AppInput.vue'
import AppButton from '@/components/App/AppButton.vue'
import UIToast from '@/components/UI/UIToast.vue'
import useVuelidate from '@vuelidate/core'
import { ref, computed, reactive } from 'vue'
import { useUser } from '@/store/user'
import { useRouter } from 'vue-router'
import { useValidation } from '@/composables/validation'
import { useLoginForm } from '@/forms/login'

const router = useRouter()

const form = reactive({
	login: '',
	password: '',
})

const validationRules = computed(() => useValidation(useLoginForm()))
const v$ = useVuelidate(validationRules, form)

const toast = ref<InstanceType<typeof UIToast>>()

const userStore = useUser()

async function logIn() {
	v$.value.$validate()

	if (!v$.value.$error) {
		const res = await userStore.logIn(form.login, form.password)

		if (res === 'ok') {
			userStore.refreshAccessToken()
			await userStore.getUser()

			router.push('/')
		} else {
			toast.value?.err(res)
		}
	}
}
</script>

<template>
	<div class="flex justify-center radial h-full !pl-0">
		<UIToast ref="toast" />

		<form
			class="flex flex-col space-y-4 lg:space-y-6 bg-white"
			@submit.prevent
		>
			<img
				src="@/assets/logo.svg"
				class="w-10 h-10 mx-auto"
			/>

			<div class="text-gray-700">
				<AppInput
					v-model="form.login"
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

			<div class="mt-4 text-gray-700">
				<AppInput
					v-model="form.password"
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

<style scoped>
form {
	@apply transition-all duration-300 ease-in-out
	min-w-[320px] w-full h-full
	md:(absolute top-1/5 w-1/3 h-max px-16 pt-8 pb-12 rounded-xl)
	px-6 pt-32 pb-12;
}

.radial {
	background: radial-gradient(circle, #4c1d95 -50%, #181818 55%);
}
</style>

<script setup lang="ts">
import AppButton from '@/components/App/AppButton.vue'
import AppForm from '@/components/App/AppForm.vue'
import { useUser } from '@/store/user'
import { inject, nextTick, onMounted, reactive, ref } from 'vue'
import { FormItem } from '@/models'
import { useAccountForm } from '@/forms/account'
import { AxiosError, AxiosStatic } from 'axios'
import { useToast } from '@/composables/toast'

const axios = inject('axios') as AxiosStatic
const userStore = useUser()

const { user } = userStore

const accountForm = ref<FormItem[][]>([[]])
const userForm = ref<InstanceType<typeof AppForm> | null>(null)

const account: { [key: string]: string } = reactive({})

onMounted(() => {
	const form = useAccountForm()

	form[0].value = user.name
	form[1].value = user.login
	form[2].placeholder = 'Новий пароль'
	form[3].value = user.role

	accountForm.value[0].push(...form)
})

async function updateUser() {
	if (account.password.length === 0) {
		accountForm.value[0][2].validations = {}
		delete account.password

		await nextTick()
	}

	if (userForm.value?.validateForm()) {
		try {
			await axios.put(`/users/${user._id}`, account)
			await userStore.getUser()

			accountForm.value[0][2].validations = useAccountForm()[2].validations
			userForm.value?.resetValidation()

			useToast('Дані оновлені', 'success')
		} catch (error) {
			const err = error as AxiosError
			useToast(err.response?.data, 'error')
		}
	}
}
</script>

<template>
	<div>
		<h1 class="title lg:text-xl mb-6">Налаштування користувача</h1>

		<AppForm
			ref="userForm"
			:step="1"
			:steps="1"
			:schema="accountForm"
			@input="Object.assign(account, $event)"
		/>

		<div class="mt-6">
			<AppButton @click="updateUser">Зберегти</AppButton>
		</div>
	</div>
</template>

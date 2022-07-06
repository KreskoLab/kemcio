<script
	setup
	lang="ts"
>
import AppButton from '@/components/App/AppButton.vue'
import AppForm from '@/components/App/AppForm.vue'
import { useUser } from '@/store/user'
import { inject, nextTick, onMounted, reactive, ref } from 'vue'
import { FormItem } from '@/models'
import { useAccountForm } from '@/forms/account'
import { AxiosStatic } from 'axios'

const axios = inject('axios') as AxiosStatic
const userStore = useUser()

const { name, login, _id } = userStore

const accountForm = ref<FormItem[][]>([[]])
const accountFormComponent = ref<InstanceType<typeof AppForm> | null>(null)
let account: { [key: string]: string } = reactive({})

onMounted(() => {
	const form = useAccountForm()

	form[0].value = name
	form[1].value = login
	form[2].placeholder = 'Новий пароль'

	accountForm.value[0].push(...form)
})

async function updateUser() {
	if (account.password.length === 0) {
		accountForm.value[0][2].validations = {}
		delete account.password

		await nextTick()
	}

	if (accountFormComponent.value?.validateForm()) {
		await axios.put(`/users/${_id}`, account).then(() => {
			accountForm.value[0][2].validations = useAccountForm()[2].validations
			accountFormComponent.value?.resetValidation()
			userStore.getUser()
		})
	}
}
</script>

<template>
	<div>
		<h1 class="title lg:text-xl mb-6">Налаштування користувача</h1>

		<AppForm
			ref="accountFormComponent"
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

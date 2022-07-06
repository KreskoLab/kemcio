<script setup lang="ts">
import AppButton from '@/components/App/AppButton.vue'
import AppForm from '@/components/App/AppForm.vue'
import AppModal from '@/components/App/AppModal.vue'
import type { FormItem, User } from '@/models'
import { useUser } from '@/store/user'
import { inject, nextTick, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { AxiosStatic } from 'axios'
import { useAccountForm } from '@/forms/account'

const axios = inject('axios') as AxiosStatic
const userStore = useUser()

const remove = reactive({ id: '', name: '', status: false })
const userToUpdate = reactive({ id: '', status: false })

const newUserForm = ref<FormItem[][]>([[]])
const formComponent = ref<InstanceType<typeof AppForm> | null>(null)
const users = ref<User[]>([])

const newUser: { [key: string]: string } = reactive({})
const addUser = ref(false)

onBeforeMount(async () => await getUsers())

onMounted(() => {
	const form = useAccountForm()
	newUserForm.value[0].push(...form)
})

watch(
	() => userToUpdate.status,
	(val) => {
		if (val) {
			const user = users.value.find((item) => item._id === userToUpdate.id)

			if (user) {
				newUserForm.value[0][0].value = user?.name
				newUserForm.value[0][1].value = user?.login
				newUser.password = ''
			}
		}
	}
)

async function getUsers() {
	await axios.get<User[]>('/users').then((res) => (users.value = res.data))
}

async function removeUser() {
	await axios.delete(`/users/${remove.id}`).then(async () => {
		remove.id = ''
		remove.name = ''
		remove.status = false

		await getUsers()
	})
}

async function createUser() {
	if (await formComponent.value?.validateForm()) {
		await axios.post('/users', newUser).then(async () => {
			addUser.value = false
			await getUsers()
		})
	}
}

async function updateUser() {
	if (newUser.password.length === 0) {
		newUserForm.value[0][2].validations = {}
		delete newUser.password

		await nextTick()
	}

	if (await formComponent.value?.validateForm()) {
		await axios.put(`/users/${userToUpdate.id}`, newUser).then(async () => {
			userToUpdate.id = ''
			userToUpdate.status = false

			newUserForm.value[0][2].validations = useAccountForm()[2].validations
			formComponent.value?.resetValidation()

			await getUsers()
		})
	}
}

function hideModal() {
	addUser.value = false
	userToUpdate.status = false
}
</script>

<template>
	<AppModal
		v-if="remove.status"
		size="md"
		@close="remove.status = false"
	>
		<template #header>
			<h1 class="title">Видалити користувача</h1>
		</template>

		<template #body>
			<p class="subtitle">Користувача {{ remove.name }} буде видалено із системи!</p>
		</template>

		<template #footer>
			<div class="flex justify-between mt-2">
				<AppButton
					transparent
					class="w-64"
					@click="remove.status = false"
				>
					Назад
				</AppButton>

				<AppButton @click="removeUser()">Так</AppButton>
			</div>
		</template>
	</AppModal>

	<AppModal
		v-if="addUser || userToUpdate.status"
		size="md"
		@close="hideModal()"
	>
		<template #header>
			<h1 class="title">
				<template v-if="addUser">Новий користувач</template>
				<template v-if="userToUpdate.status">Редагувати користувача</template>
			</h1>
		</template>

		<template #body>
			<AppForm
				ref="formComponent"
				:step="1"
				:steps="1"
				:schema="newUserForm"
				@input="Object.assign(newUser, $event)"
			/>
		</template>

		<template #footer>
			<div class="flex justify-between mt-2">
				<template v-if="addUser">
					<AppButton @click="createUser()">Додати</AppButton>
				</template>

				<template v-if="userToUpdate.status">
					<AppButton @click="updateUser()">Оновити</AppButton>
				</template>
			</div>
		</template>
	</AppModal>

	<div>
		<div class="flex items-center justify-between mb-6">
			<h1 class="title lg:text-xl">Користувачі</h1>

			<AppButton
				class="w-max"
				size="sm"
				@click="addUser = true"
			>
				<span>новий</span>
			</AppButton>
		</div>

		<div class="relative overflow-x-auto rounded-lg">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead class="title uppercase bg-purple-50/40 dark:bg-dark-200">
					<tr>
						<th
							scope="col"
							class="px-6 py-3"
						>
							Ім'я
						</th>
						<th
							scope="col"
							class="px-6 py-3"
						>
							Логін
						</th>

						<th
							scope="col"
							class="px-6 py-3"
						>
							<span class="sr-only">Edit</span>
						</th>
					</tr>
				</thead>

				<tbody>
					<tr
						v-for="user in users"
						:key="user._id"
						class="border-b dark:bg-dark-400 dark:border-dark-400 border-gray-100 odd:bg-light-50 even:bg-purple-50/40 odd:dark:bg-dark-400 even:dark:bg-dark-200"
					>
						<th
							scope="row"
							class="px-6 py-4 title whitespace-nowrap"
						>
							{{ user.name }}
						</th>

						<td class="px-6 py-4 subtitle">{{ user.login }}</td>

						<td>
							<div
								v-if="user._id !== userStore._id"
								class="flex space-x-4 sm:(justify-around space-x-0) px-6 py-4"
							>
								<button
									class="text-purple-600 dark:text-purple-500"
									@click="Object.assign(userToUpdate, { id: user._id, status: true })"
								>
									<i-lucide-pencil />
								</button>

								<button
									class="text-purple-600 dark:text-purple-500 hover:text-red-500"
									@click="Object.assign(remove, { id: user._id, name: user.name, status: true })"
								>
									<i-lucide-trash />
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
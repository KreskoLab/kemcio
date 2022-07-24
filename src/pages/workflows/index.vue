<script setup lang="ts">
import AppButton from '@/components/App/AppButton.vue'
import AppModal from '@/components/App/Modal/AppModal.vue'
import AppModalDelete from '@/components/App/Modal/AppModalDelete.vue'
import AppInput from '@/components/App/AppInput.vue'
import AppDropdown from '@/components/App/Dropdown/AppDropdown.vue'
import AppDropdownItem from '@/components/App/Dropdown/AppDropdownItem.vue'
import { AxiosStatic } from 'axios'
import { inject, reactive, ref } from 'vue'
import type { Workflow } from '@/models'

const axios = inject('axios') as AxiosStatic

const workflows = ref<Workflow[]>([])

const add = ref<boolean>(false)
const name = ref<string>('')
const dropdownActive = ref<boolean>(false)

const rename = reactive({
	status: false,
	id: '',
})

const remove = reactive({
	status: false,
	id: '',
	name: '',
})

await getWorkflows()

const onPause = (status: boolean) => (status ? 'Вимкнути' : 'Увімкнути')
const isWokrking = (status: boolean) => (status ? 'Увімкнен' : 'Вимкнен')

function getDate(createdAt: Date) {
	return new Date(createdAt).toLocaleDateString('uk-UA', { dateStyle: 'long' })
}

function renameWorkflow(val: string, id: string) {
	name.value = val
	rename.status = true
	rename.id = id
	add.value = true
}

function resetNew() {
	add.value = false
	rename.status = false
	rename.id = ''
	name.value = ''
}

async function addWorkflow() {
	await axios
		.post('/workflows', {
			name: name.value,
		})
		.then(async () => {
			resetNew()
			await getWorkflows()
		})
}

async function updateWorkflow(id: string, body: Partial<Workflow>) {
	await axios.put<Workflow>(`/workflows/${id}`, body).then((res) => {
		const workflow = workflows.value.find((item) => item._id === id)
		if (workflow) Object.assign(workflow, res.data)

		resetNew()
	})
}

async function removeWorkflow(id: string) {
	await axios.delete<Workflow>(`/workflows/${id}`).then(async () => {
		remove.id = ''
		remove.name = ''
		remove.status = false

		await getWorkflows()
	})
}

async function getWorkflows() {
	await axios.get('/workflows').then((res) => (workflows.value = res.data))
}
</script>

<template>
	<div class="padding min-w-[360px] h-full">
		<AppModalDelete
			v-if="remove.status"
			title="Видалити сценарій"
			@close="remove.status = false"
			@remove="removeWorkflow(remove.id)"
		>
			<p class="subtitle text-base">Сценарій {{ remove.name }} буде видалено!</p>
		</AppModalDelete>

		<AppModal
			v-if="add"
			size="base"
			@close="add = false"
		>
			<template #header>
				<h1 class="title text-lg">Сценарій</h1>
			</template>

			<template #body>
				<div class="my-3">
					<AppInput
						v-model="name"
						placeholder="Назва"
					/>
				</div>
			</template>

			<template #footer>
				<div class="flex space-x-2">
					<AppButton
						transparent
						@click="resetNew()"
					>
						Назад
					</AppButton>

					<AppButton
						v-if="rename.status"
						@click="updateWorkflow(rename.id, { name: name })"
					>
						Оновити
					</AppButton>

					<AppButton
						v-else
						@click="addWorkflow()"
					>
						Додати
					</AppButton>
				</div>
			</template>
		</AppModal>

		<div>
			<div class="flex items-center space-x-5">
				<h1 class="font-medium text-slate-700 dark:text-gray-200 text-3xl">Сценарії</h1>

				<AppButton
					size="sm"
					class="w-max"
					@click="add = true"
				>
					<span>новий</span>
				</AppButton>
			</div>

			<div class="flex flex-col items-start gap-y-12 lg:(flex-row flex-wrap items-stretch gap-x-16 my-12) my-8">
				<article
					v-for="workflow in workflows"
					:key="workflow._id"
					class="flex flex-col space-y-4 form border-2 w-full lg:w-68 py-3 px-4"
					:class="{
						'hover:(dark:border-purple-400 border-purple-300 cursor-pointer transition duration-150)': !dropdownActive,
					}"
				>
					<section class="flex justify-between items-center">
						<router-link
							:to="`/workflows/${workflow._id}`"
							class="w-full"
						>
							<div class="flex items-center space-x-3">
								<div class="bg-gray-100 dark:bg-dark-200 rounded-md w-max p-2">
									<i-lucide-flask-conical class="title w-6 h-6" />
								</div>

								<h2 class="title truncate">{{ workflow.name }}</h2>
							</div>
						</router-link>

						<AppDropdown @change="dropdownActive = $event">
							<template #header>
								<div class="title">
									<i-lucide-more-horizontal />
								</div>
							</template>

							<AppDropdownItem @click="updateWorkflow(workflow._id, { pause: !workflow.pause })">
								<i-lucide-toggle-right class="text-lg" />
								<span>{{ onPause(workflow.pause) }}</span>
							</AppDropdownItem>

							<AppDropdownItem @click="renameWorkflow(workflow.name, workflow._id)">
								<i-lucide-pencil class="text-lg" />
								<span>Редагувати</span>
							</AppDropdownItem>

							<AppDropdownItem @click="Object.assign(remove, { status: true, id: workflow._id, name: workflow.name })">
								<i-lucide-trash class="text-lg" />
								<span>Видалити</span>
							</AppDropdownItem>
						</AppDropdown>
					</section>

					<section class="subtitle">
						<h3 class="text-base">{{ isWokrking(workflow.pause) }}</h3>
						<h3>{{ getDate(workflow.createdAt) }}</h3>
					</section>
				</article>
			</div>
		</div>
	</div>
</template>

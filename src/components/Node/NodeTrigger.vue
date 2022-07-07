<script lang="ts">
export default {
	inheritAttrs: false,
}
</script>

<script setup lang="ts">
import Node from '@/components/Node/Node.vue'
import AppModal from '@/components/App/Modal/AppModal.vue'
import AppButton from '@/components/App/AppButton.vue'
import NodeHandler from '@/components/Node/NodeHandler.vue'
import AppForm from '@/components/App/AppForm.vue'
import type { FormItem } from '@/models'
import { Position } from '@braks/vue-flow'
import { onMounted, reactive, ref, watch } from 'vue'
import { updateNodeData, updateNodeState } from '@/composables/update-node'
import { useTriggerForm } from '@/forms/trigger'

const baseNode = ref<InstanceType<typeof Node> | null>(null)
const id = ref<string>('')
const schema = ref<FormItem[][]>([[]])

onMounted(() => {
	id.value = baseNode.value?.id as string
	updateNodeState(state, id.value)

	const form = useTriggerForm()

	form[0].value = state.option
	form[1].value = state.value

	schema.value[0].push(...form)
})

const editNode = ref<boolean>(false)

const state = reactive({
	option: '',
	value: '',
})

watch(state, () => updateNodeData(id.value, state))
</script>

<template>
	<AppModal
		v-if="editNode"
		size="md"
		@close="editNode = false"
	>
		<template #header>
			<h1 class="title">Тріггер</h1>
		</template>

		<template #body>
			<div class="transition-transform duration-300 ease-in-out">
				<AppForm
					:step="1"
					:steps="1"
					:schema="schema"
					@input="Object.assign(state, $event)"
				/>
			</div>
		</template>

		<template #footer>
			<div class="mt-2">
				<AppButton @click="editNode = false">Зберегти</AppButton>
			</div>
		</template>
	</AppModal>

	<Node
		ref="baseNode"
		edit
		@edit="editNode = true"
	>
		<template #handle>
			<NodeHandler
				:positon="Position.Right"
				:type="'source'"
			/>
		</template>
	</Node>
</template>

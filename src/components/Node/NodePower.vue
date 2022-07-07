<script lang="ts">
export default {
	inheritAttrs: false,
}
</script>

<script setup lang="ts">
import Node from '@/components/Node/Node.vue'
import NodeHandler from '@/components/Node/NodeHandler.vue'
import AppToggle from '@/components/App/AppToggle.vue'
import AppModal from '@/components/App/Modal/AppModal.vue'
import AppSelect from '@/components/App/AppSelect.vue'
import { NodeData, Device, OptionModel } from '@/models'
import { Position } from '@braks/vue-flow'
import { onMounted, reactive, ref, useAttrs, watch } from 'vue'
import { useBlocks } from '@/store/blocks'
import { updateNodeData, updateNodeState } from '@/composables/update-node'

const blocksStore = useBlocks()

const baseNode = ref<InstanceType<typeof Node> | null>(null)
const id = ref<string>('')

const attrs = useAttrs() as unknown as NodeData

const editNode = ref<boolean>(false)

const state = reactive({
	device: '',
	value: 'OFF',
})

onMounted(() => {
	id.value = baseNode.value?.id as string
	updateNodeState(state, id.value)
})

const devices = blocksStore.getDevicesByElement(attrs.data.element) as Pick<Device, '_id' | 'name'>[]
const triggerOptions = devices.map((item) => ({ label: item.name, value: item._id })) as OptionModel[]

watch(state, () => updateNodeData(id.value, state))
</script>

<template>
	<AppModal
		v-if="editNode"
		:size="'md'"
		@close="editNode = false"
	>
		<template #header>
			<h1 class="title">Пристрій</h1>
		</template>

		<template #body>
			<div class="transition-transform duration-300 ease-in-out">
				<AppSelect
					v-model="state.device"
					placeholder="Обрати"
					:options="triggerOptions"
				/>
			</div>
		</template>

		<template #footer>
			<AppButton @click="editNode = false">Зберегти</AppButton>
		</template>
	</AppModal>

	<Node
		ref="baseNode"
		edit
		:name="attrs.data.name"
		:icon="attrs.data.icon"
		@edit="editNode = true"
	>
		<template #handle>
			<NodeHandler
				:positon="Position.Left"
				:type="'target'"
			/>
		</template>

		<AppToggle
			v-model="state.value"
			true-value="ON"
			false-value="OFF"
			@input="state.value = $event as string"
		/>
	</Node>
</template>

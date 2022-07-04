<script
	setup
	lang="ts"
>
import { NodeIdInjection, useVueFlow } from '@braks/vue-flow'
import { onClickOutside } from '@vueuse/core'
import { inject, ref } from 'vue'
import { getNodeById } from '@/composables/nodes'
import { useIcon } from '@/composables/get-icon'

defineProps<{
	edit?: boolean
}>()

defineEmits(['edit'])

const node = ref(null)
const showTools = ref<boolean>(false)
const id = ref(inject(NodeIdInjection) as string)

const { removeNodes } = useVueFlow()

const nodeData = getNodeById(id.value)

onClickOutside(node, () => (showTools.value = false))

defineExpose({
	id,
})
</script>

<template>
	<div
		ref="node"
		@click="showTools = true"
	>
		<slot name="handle" />

		<div
			class="overflow-hidden z-50 flex flex-col space-y-4 rounded-md dark:bg-dark-300 bg-light-400 dark:text-light-400 py-4 px-4"
			:class="{ 'dark:border-light-100': showTools }"
		>
			<div class="flex items-center space-x-3">
				<div class="bg-purple-300 rounded-lg p-2">
					<svg
						viewBox="0 0 24 24"
						class="text-dark-600 w-5 h-5"
						v-html="useIcon(nodeData?.icon as string)"
					/>
				</div>

				<h3 class="title">{{ nodeData?.name }}</h3>
			</div>

			<div class="max-w-38">
				<slot />
			</div>

			<Transition>
				<div
					v-if="showTools"
					class="flex space-x-2 -z-1 absolute -bottom-7 left-0 bg-gray-200 dark:bg-light-200 dark:text-dark-600 rounded-lg py-1 px-3"
					:class="{ '!-bottom-9': edit }"
				>
					<button
						v-if="edit"
						@click="$emit('edit')"
					>
						<i-lucide-pencil class="h-4 w-4" />
					</button>

					<span v-if="edit">|</span>

					<button @click="removeNodes([id])">
						<i-lucide-trash-2 class="h-4 w-4" />
					</button>
				</div>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: all 0.4s ease;
}

.v-enter-to {
	transform: translateY(0px);
}

.v-enter-from,
.v-leave-to {
	transform: translateY(-40px);
}
</style>

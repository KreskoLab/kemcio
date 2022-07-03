<script
	setup
	lang="ts"
>
import { computed } from '@vue/reactivity'
import { onMounted, provide, ref, useSlots } from 'vue'

const props = defineProps<{
	modelValue: number
}>()

const emit = defineEmits<{
	(event: 'update:modelValue', tab: number): void
}>()

let slots = useSlots()

const tabs = computed(() => slots['default'] && slots['default']().filter((item) => item.children !== 'v-if'))
const activeTab = ref<string>('')

function selectTab(index: number) {
	activeTab.value = tabs.value?.find((_, i) => i === index)?.props?.label as string
	emit('update:modelValue', index)
}

onMounted(() => {
	if (props.modelValue) selectTab(props.modelValue)
	else selectTab(0)
})

provide('activeTab', activeTab)
</script>

<template>
	<ul class="flex space-x-8 pb-2 border-b-2 border-dark-200">
		<li
			v-for="(tab, index) in tabs"
			:key="tab.props?.label"
			class="dark:text-gray-400 cursor-pointer"
			:class="{ '!dark:text-light-200': tab.props?.label === activeTab }"
			@click="selectTab(index)"
		>
			{{ tab.props?.label }}
		</li>
	</ul>

	<div class="my-4">
		<slot />
	</div>
</template>

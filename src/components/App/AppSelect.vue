<script setup lang="ts">
import { reactive, ref, Ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { computed } from '@vue/reactivity'
import { OptionModel } from '@/models/option-model'

const props = defineProps<{
	label?: string
	placeholder: string
	options: Array<OptionModel>
	modelValue?: object | string | number | boolean
	error?: boolean
	errorMessage?: string | Ref<string>
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: object | string | number): void
}>()

const target = ref<HTMLElement | null>(null)
const active = ref<boolean>(false)

const selected = reactive<OptionModel>({ value: '', label: '' })

if (props.modelValue) {
	const option = props.options.find((option) => option.value === props.modelValue)
	if (option) Object.assign(selected, option)
}

const display = computed(() => {
	return selected.label.length ? selected.label : props.placeholder
})

onClickOutside(target, () => (active.value = false))

function select(option: OptionModel) {
	Object.assign(selected, option)
	active.value = false

	emit('update:modelValue', option.value)
}
</script>

<template>
	<div class="flex flex-col space-y-3">
		<label class="text-lg dark:text-gray-300">{{ label }}</label>

		<div
			ref="target"
			class="relative"
		>
			<button
				class="inline-flex justify-between items-center w-full bg-white dark:bg-dark-400 dark:text-gray-200 focus:(outline-none border-purple-300) py-2 px-3 text-sm text-left border-3 border-gray-200 dark:border-dark-200 rounded-md"
				:class="[
					{
						'border-red-400': error,
					},
				]"
				@click="active = !active"
			>
				<span
					class="select-none"
					:class="display === placeholder ? 'text-gray-400 dark:text-gray-400' : 'text-slate-700 dark:text-gray-200'"
				>
					{{ display }}
				</span>

				<i-lucide-chevron-down />
			</button>

			<Transition
				enter-active-class="animate-animated animate-faster animate-fadeIn"
				leave-active-class="animate-animated animate-faster animate-fadeOut"
				:duration="100"
			>
				<ul
					v-if="active"
					class="absolute z-999 mt-2 w-full max-h-40 overflow-y-auto bg-white dark:bg-dark-400 border-2 border-gray-200 dark:border-dark-200 rounded-md"
				>
					<li
						v-for="option in options"
						:key="option.label"
						class="py-2 px-3 text-gray-500 dark:text-gray-400 transition duration-100 hover:(bg-slate-50 cursor-pointer) dark:hover:bg-dark-200"
						:class="[
							{
								'bg-purple-50 hover:bg-purple-50 dark:bg-purple-800/30 dark:hover:bg-purple-800/30 dark:text-gray-200':
									option.label === selected.label,
							},
						]"
						@click="select(option)"
					>
						{{ option.label }}
					</li>
				</ul>
			</Transition>
		</div>

		<div
			class="h-0 transition-all duration-300 ease-in-out"
			:class="{ '!h-4': error }"
		>
			<transition
				enter-active-class="animate-animated animate-fadeIn"
				leave-active-class="animate-animated animate-fadeOut"
			>
				<p
					v-if="error"
					class="text-red-400 text-xs"
				>
					{{ errorMessage }}
				</p>
			</transition>
		</div>
	</div>
</template>

<style scoped>
ul {
	@apply scrollbar-thin scrollbar-thumb-gray-100  dark:scrollbar-thumb-dark-300 scrollbar-track-transparent;
}
</style>

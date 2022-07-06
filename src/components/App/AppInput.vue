<template>
	<div class="flex flex-col space-y-2">
		<label
			v-if="label"
			class="text-lg dark:text-gray-300"
		>
			{{ label }}
		</label>

		<div class="relative">
			<div class="absolute inset-y-3 left-3 text-gray-600">
				<slot name="icon" />
			</div>

			<div
				v-if="password"
				class="absolute inset-y-3 right-3 dark:text-gray-400 text-gray-400 cursor-pointer"
				@click="showPassword()"
			>
				<i-lucide-eye v-if="inputType === 'password'" />
				<i-lucide-eye-off v-else />
			</div>

			<input
				class="w-full bg-white dark:bg-dark-400 text-gray-600 dark:text-gray-200 border-3 border-gray-200 dark:border-dark-200 transition duration-150 focus:(outline-none border-purple-300 dark:border-purple-300) py-2 pl-3 text-sm rounded-md"
				:class="[
					{
						'border-red-400': error,
						'pl-9': $slots.icon,
					},
				]"
				:type="inputType"
				:placeholder="placeholder"
				:value="modelValue"
				@input="updateValue($event)"
			/>
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

<script
	setup
	lang="ts"
>
import { ref, Ref } from 'vue'

const props = defineProps<{
	label?: string
	placeholder?: string
	modelValue?: string
	error?: boolean
	password?: boolean
	errorMessage?: string | Ref<string>
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', text: string): void
}>()

const updateValue = (e: Event) => {
	emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const inputType = ref(props.password ? 'password' : 'text')
const showPassword = () => (inputType.value = inputType.value === 'password' ? 'text' : 'password')
</script>

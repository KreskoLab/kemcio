<script setup lang="ts">
import { reactive } from 'vue'

type toastType = 'success' | 'warn' | 'error'

interface Toast {
	id: string
	message: string
	type: toastType
}

const toasts = reactive<Toast[]>([])

function add(message: string, type: toastType) {
	const toast: Toast = { id: Math.random().toString(32), message, type }

	toasts.push(toast)
	setTimer(toast)
}

function remove(toast: Toast) {
	const index = toasts.findIndex((item) => item.id === toast.id)
	toasts.splice(index, 1)
}

function setTimer(toast: Toast) {
	setTimeout(() => {
		remove(toast)
	}, 5000)
}

defineExpose({ add })
</script>

<template>
	<div class="fixed top-4 right-4">
		<transition-group
			tag="ul"
			enter-active-class="animate-animated animate-bounceInDown"
			leave-active-class="animate-animated animate-bounceOut"
		>
			<li
				v-for="toast in toasts"
				:key="toast.id"
				class="pt-2"
			>
				<div class="flex items-center space-x-3 w-full sm:w-72 py-3 px-4 form">
					<i-lucide-alert-circle
						class="w-6 h-6"
						:class="[
							{
								'text-red-400': toast.type === 'error',
							},
							{
								'text-amber-400': toast.type === 'warn',
							},
							{
								'text-green-400': toast.type === 'success',
							},
						]"
					/>
					<span class="title text-base font-normal">{{ toast.message }}</span>
				</div>
			</li>
		</transition-group>
	</div>
</template>

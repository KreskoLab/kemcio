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
	<Teleport to="#modal-area">
		<div class="fixed top-4 right-4 z-100">
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
					<div class="flex items-center space-x-3 w-full sm:(max-w-72) py-3 px-4 form">
						<i-lucide-alert-circle
							v-if="toast.type === 'error'"
							class="w-6 h-6 flex-shrink-0 text-red-400"
						/>

						<i-lucide-alert-triangle
							v-if="toast.type === 'warn'"
							class="w-6 h-6 flex-shrink-0 text-amber-400"
						/>

						<i-lucide-check-circle
							v-if="toast.type === 'success'"
							class="w-6 h-6 flex-shrink-0 text-green-400"
						/>

						<span class="title text-base font-normal">{{ toast.message }}</span>
					</div>
				</li>
			</transition-group>
		</div>
	</Teleport>
</template>

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
				<div
					class="flex items-center space-x-3 w-full sm:w-72 py-3 px-4 rounded-md bg-red-400 text-light-100"
				>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>{{ toast.message }}</span>
				</div>
			</li>
		</transition-group>
	</div>
</template>

<script
	setup
	lang="ts"
>
import { reactive } from 'vue'

interface Toast {
	id: string
	message: string
	type: string
}

const toasts = reactive<Toast[]>([])

function err(message: string) {
	add(message, 'err')
}

function add(message: string, type: string) {
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

defineExpose({ err })
</script>

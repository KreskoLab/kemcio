<script setup lang="ts">
import { ModalSize } from '@/models'
import { onMounted, ref } from 'vue'

interface Props {
	size: ModalSize
}

defineProps<Props>()

const emit = defineEmits(['close'])

const show = ref<boolean>(false)

function close() {
	show.value = false

	setTimeout(() => {
		emit('close')
	}, 500)
}

onMounted(() => (show.value = true))
</script>

<template>
	<Teleport to="#modal-area">
		<div class="flex justify-center items-center fixed z-50 w-full h-full bg-dark-900 bg-opacity-80">
			<Transition
				enter-active-class="animate-animated animate-faster animate-fadeInUp"
				leave-active-class="animate-animated animate-faster animate-fadeOutDown"
			>
				<div
					v-if="show"
					class="flex flex-col space-y-5 h-full w-full py-24 sm:(rounded-3xl pb-4 h-max) bg-light-100 dark:bg-dark-600 px-8 overflow-y-auto"
					:class="[
						{ '!sm:(max-h-[320px] max-w-sm py-6)': size === 'base' },
						{ '!sm:(max-h-[460px] w-md py-8)': size === 'md' },
						{ '!sm:(max-h-[580px] w-lg pt-8 pb-6)': size === 'lg' },
						{ '!sm:(max-h-[720px] w-2xl pt-6)': size === 'xl' },
					]"
				>
					<section class="flex justify-between items-center">
						<div>
							<slot name="header" />
						</div>

						<button @click="close()">
							<i-lucide-x-circle class="text-gray-600 dark:text-light-600" />
						</button>
					</section>

					<section>
						<slot name="body" />
					</section>

					<footer class="!mt-4">
						<slot name="footer" />
					</footer>
				</div>
			</Transition>
		</div>
	</Teleport>
</template>

<script
	setup
	lang="ts"
>
import { onMounted, ref } from 'vue'

type Size = 'base' | 'lg'

interface Props {
	size: Size
}

// eslint-disable-next-line vue/no-setup-props-destructure
const { size = 'base' } = defineProps<Props>()
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
					class="flex flex-col space-y-4 rounded-3xl dark:bg-dark-600 px-8 py-6"
					:class="[{ 'min-w-96': size === 'base' }, { 'w-lg': size === 'lg' }]"
				>
					<section class="flex justify-between items-center">
						<div>
							<slot name="header" />
						</div>

						<button @click="close()">
							<i-lucide-x-circle class="text-light-600" />
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

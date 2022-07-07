<script setup lang="ts">
import AppModal from '@/components/App/Modal/AppModal.vue'
import AppButton from '@/components/App/AppButton.vue'

defineProps<{
	title: string
}>()

defineEmits<{
	(event: 'close'): void
	(event: 'remove'): void
}>()
</script>

<template>
	<AppModal
		size="base"
		@close="$emit('close')"
	>
		<template #header>
			<h1 class="title text-lg">{{ title }}</h1>
		</template>

		<template #body>
			<div class="my-2">
				<slot />
			</div>
		</template>

		<template #footer>
			<div class="flex space-x-2">
				<AppButton
					transparent
					@click="$emit('close')"
				>
					Назад
				</AppButton>

				<AppButton
					variant="danger"
					@click="$emit('remove')"
				>
					Підтвердити
				</AppButton>
			</div>
		</template>
	</AppModal>
</template>

<template>
	<div
		ref="parent"
		class="relative w-full flex items-center justify-center"
	>
		<div
			class="z-10"
			@mouseenter="show = true"
			@mouseleave="show = false"
		>
			<slot />
		</div>

		<Transition
			enter-active-class="animate-animated animate-fadeIn"
			leave-active-class="animate-animated animate-fadeOutLeft"
			:duration="{ enter: 150, leave: 100 }"
		>
			<div
				v-if="show"
				class="absolute min-w-24 py-1.5 px-3 rounded-md"
				:class="`bg-${color}`"
				:style="{ left: tooltipOffset + 'px' }"
			>
				<p class="font-medium text-center text-light-50 select-none">
					{{ text }}
				</p>
			</div>
		</Transition>
	</div>
</template>

<script
	setup
	lang="ts"
>
import { onMounted, ref } from 'vue'

const props = defineProps<{
	text: string
	color: string
}>()

const parent = ref<HTMLElement | null>(null)
const tooltipOffset = ref<number>(0)
const show = ref<boolean>(false)

onMounted(() => {
	tooltipOffset.value = parent.value.clientWidth + 18
})
</script>

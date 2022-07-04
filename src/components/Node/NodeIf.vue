<script
	setup
	lang="ts"
>
import Node from '@/components/Node/Node.vue'
import NodeHandler from '@/components/Node/NodeHandler.vue'
import { Position } from '@braks/vue-flow'
</script>

<template>
	<Node>
		<template #handle>
			<NodeHandler
				id="start"
				:positon="Position.Left"
				:type="'target'"
			/>

			<div class="flex items-center space-x-3 top-auto bottom-2 -left-1 absolute">
				<NodeHandler
					id="condition"
					:positon="Position.Left"
					:type="'target'"
				/>

				<p>Умова</p>
			</div>

			<div class="flex items-center top-2 -right-1 absolute">
				<p class="mr-3">Так</p>

				<NodeHandler
					id="true"
					:positon="Position.Right"
					:type="'source'"
				/>
			</div>

			<div class="flex items-center top-auto bottom-2 -right-1 absolute">
				<p class="mr-3">Ні</p>

				<NodeHandler
					id="false"
					:positon="Position.Right"
					:type="'source'"
				/>
			</div>
		</template>
	</Node>
</template>

<style scoped>
p {
	@apply text-xs text-dark-200 dark:text-light-600 font-thin;
}
</style>

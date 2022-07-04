<script
	setup
	lang="ts"
>
import type { ValidConnectionFunc } from '@braks/vue-flow'
import Node from '@/components/Node/Node.vue'
import NodeHandler from '@/components/Node/NodeHandler.vue'
import { Position } from '@braks/vue-flow'
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<template>
	<Node>
		<template #handle>
			<NodeHandler
				:positon="Position.Right"
				:type="'source'"
				:is-valid-connection="(attrs['is-valid-target-pos'] as ValidConnectionFunc)"
			/>

			<NodeHandler
				id="a"
				:positon="Position.Left"
				:type="'target'"
			/>

			<NodeHandler
				id="b"
				:positon="Position.Left"
				:type="'target'"
			/>
		</template>
	</Node>
</template>

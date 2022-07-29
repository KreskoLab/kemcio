import { createVNode, render } from 'vue'
import { Toast } from '@/models'
import AppToast from '@/components/App/AppToast.vue'

const vNode = createVNode(AppToast)
const el = document.createElement('div')

render(vNode, el)

export const useToast = (message: string, type: Toast) => {
	vNode.component?.exposed?.add(message, type)
}

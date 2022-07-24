import { Ref } from 'vue'
import { Toast } from '@/models'
import AppToast from '@/components/App/AppToast.vue'

export const useToast = (toast: Ref<InstanceType<typeof AppToast> | null>, type: Toast, message: string) => {
	toast.value?.add(message, type)
}

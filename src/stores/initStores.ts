import { useUserStore } from '@/stores/user.store'
import { useToastsStore } from '@/stores/toasts.store'

export const InitStores = async (): Promise<boolean> => {
  const userStore = useUserStore()
  const toastsStore = useToastsStore()

  try {
    await userStore.validateToken()
  } catch (e) {
    toastsStore.$show({
      type: 'danger',
      text: `⛔ ${e.message}`,
    })
  }
  return true
}

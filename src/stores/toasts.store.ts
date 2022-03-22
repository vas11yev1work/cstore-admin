import { defineStore } from 'pinia'
import { CreateToastMessage, ToastMessage, ToastType } from '@/types'

type ToastState = {
  toasts: ToastMessage[],
  timeout: number,
  maxToastId: number,
  defaultType: ToastType
}

export const useToastsStore = defineStore({
  id: 'toast',
  state: (): ToastState => ({
    toasts: [],
    timeout: 3000,
    maxToastId: 0,
    defaultType: 'success'
  }),
  actions: {
    $show(toast: CreateToastMessage | string, time?: number) {
      let newToast: ToastMessage
      let timeout = 0
      if (typeof toast === 'string') {
        newToast = {
          id: this.maxToastId++,
          type: this.defaultType,
          text: toast
        }
        timeout = time || this.timeout
      } else {
        newToast = {
          id: this.maxToastId++,
          type: toast.type || this.defaultType,
          text: toast.text
        }
        timeout = toast.timeout || time || this.timeout
      }
      this.toasts.push(newToast)
      setTimeout(() => this.$remove(newToast.id), timeout)
      return newToast
    },
    $remove(id: number) {
      this.toasts = this.toasts.filter(t => t.id !== id)
    }
  }
})

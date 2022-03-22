import { defineStore } from 'pinia'

type LoaderState = {
  loading: boolean,
  requestCount: number
}

export const useLoaderStore = defineStore({
  id: 'loader',
  state: (): LoaderState => ({
    loading: false,
    requestCount: 0
  }),
  actions: {
    show() {
      this.loading = true
    },
    hide() {
      this.loading = false
    },
    pending() {
      if (this.requestCount === 0) {
        this.show()
      }
      this.requestCount++
    },
    done() {
      if (this.requestCount >= 1) {
        this.requestCount--
      }
      if (this.requestCount <= 0) {
        this.hide()
      }
    }
  }
})

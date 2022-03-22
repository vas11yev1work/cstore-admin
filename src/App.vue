<template>
  <suspense>
    <router-view />
  </suspense>
  <toasts-list />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ToastsList from '@/components/Toast/ToastsList.vue'
import { useUserStore } from '@/stores/user.store'
import { Service } from '@/utils'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'App',
  components: { ToastsList },
  setup() {
    const userStore = useUserStore()
    const refreshRequest = ref<Promise<any> | null>(null)
    const router = useRouter()

    if (sessionStorage.redirect) {
      const redirect = sessionStorage.redirect
      sessionStorage.removeItem('redirect')
      router.push(redirect)
    }

    Service.interceptors.request.use(
      config => {
        if (!userStore.token) {
          return config
        }
        const newConfig = {
          headers: {},
          ...config
        }
        newConfig.headers.Authorization = `Bearer ${userStore.token}`
        return newConfig
      },
      e => Promise.reject(e)
    )

    Service.interceptors.response.use(
      r => r,
      async error => {
        if (!userStore.refresh || error?.response?.status !== 401 || error.config.retry) {
          return Promise.reject(error)
        }
        if (!refreshRequest.value) {
          refreshRequest.value = userStore.tryRefresh()
        }
        await refreshRequest
        const newRequest = {
          ...error.config,
          retry: true
        }
        return Service(newRequest)
      }
    )
  }
})
</script>

import 'reflect-metadata'
import '@/setup'
import { createApp } from 'vue'
import router from '@/router'
import { createPinia } from 'pinia'

import App from './App.vue'

const pinia = createPinia()

const app = createApp(App)
  .use(pinia)
  .use(router)


app.mount('#app')

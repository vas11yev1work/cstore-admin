import axios  from 'axios'
import { useLoaderStore } from '@/stores/loader.store'

export const Service = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_URL || 'http://localhost:3000'
})

const getLoaderStore = () => useLoaderStore()

Service.interceptors.request.use(
  config => {
    getLoaderStore().pending()
    return config
  },
  error => {
    getLoaderStore().done()
    return Promise.reject(error)
  }
)

Service.interceptors.response.use(
  response => {
    getLoaderStore().done()
    return response
  },
  async error => {
    getLoaderStore().done()
    return Promise.reject(error)
  }
)

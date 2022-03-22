import { defineStore } from 'pinia'
import { LoginEmailDataType, LoginPhoneDataType, LoginRequestPhoneDataType, User } from '@/types'
import { Constants } from '@/types'
import { cid, container } from 'inversify-props'
import { IUserService } from '@/services/interfaces/user.service'

type UserState = {
  user: User | null
  token: string | null
  refresh: string | null,
  id: number | null
}

type UpdateTokensData = {
  token: string
  refresh: string
  id?: number
}
const userService = container.get<IUserService>(cid.UserService)

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    user: null,
    token: localStorage.getItem('token') || null,
    refresh: localStorage.getItem('refreshToken') || null,
    id: localStorage.getItem('id') ? Number(localStorage.getItem('id')) : null
  }),
  actions: {
    updateTokensData({ token, refresh, id }: UpdateTokensData) {
      this.token = token
      localStorage.setItem('token', token)
      this.refresh = refresh
      localStorage.setItem('refreshToken', refresh)
      if (id) {
        this.id = id
        localStorage.setItem('id', String(id))
      }
    },
    logout() {
      this.token = null
      this.user = null
      this.refresh = null
      this.id = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('id')
    },
    async loginEmail({ email, password }: LoginEmailDataType) {
      try {
        const { data } = await userService.loginEmail({ email, password })
        this.updateTokensData({
          token: data.token,
          refresh: data.refreshToken.token.token,
          id: data.refreshToken.id
        })
        await this.getUser()
      } catch (e) {
        if (e.response && e.response?.status === 400) {
          throw new Error('Некорректный email')
        }
        if (e.response && e.response?.status === 403) {
          throw new Error('Неверные логин или пароль')
        }
        throw new Error(Constants.UnknownError)
      }
    },
    async loginRequestPhone({ phone }: LoginRequestPhoneDataType) {
      try {
        await userService.loginRequestPhone({ phone })
      } catch (e) {
        if (e.response && e.response?.status === 400) {
          throw new Error('Некорректный номер телефона')
        }
        if (e.response && e.response?.status === 403) {
          throw new Error('Пользователь с таким номером не найден')
        }
        throw new Error(Constants.UnknownError)
      }
    },
    async loginPhone({ code, phone }: LoginPhoneDataType) {
      try {
        const { data } = await userService.loginPhone({ phone, code })
        this.updateTokensData({
          token: data.token,
          refresh: data.refreshToken.token.token,
          id: data.refreshToken.id
        })
        await this.getUser()
      } catch (e) {
        if (e.response && e.response?.status === 401) {
          throw new Error('Неверный код')
        }
        throw new Error(Constants.UnknownError)
      }
    },
    async tryRefresh() {
      try {
        if (this.id && this.refresh) {
          const response = await userService.refreshToken({
            id: this.id,
            token: this.refresh
          })
          this.updateTokensData({
            token: response.data.token,
            refresh: response.data.refreshToken.token.token,
            id: response.data.refreshToken.id
          })
          await this.getUser()
        }
      } catch (e) {
        if (e.response && (e.response?.status === 403 || e.response?.status === 400)) {
          throw new Error('Токен обновления отклонен')
        }
        throw new Error(Constants.UnknownError)
      }
    },
    async validateToken() {
      try {
        if (this.token) {
          const { data } = await userService.validateToken(this.token)
          if (!data.isValid) {
            await this.tryRefresh()
            return
          }
          await this.getUser()
        }
      } catch (e) {
        throw new Error(Constants.UnknownError)
      }
    },
    async getUser() {
      const { data } = await userService.getUserData()
      this.user = data
    }
  },
  getters: {
    isLoggedIn(state) {
      return !!state.user && !!state.token && !!state.refresh && !!state.id
    }
  }
})

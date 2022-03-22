import { AxiosInstance, AxiosResponse } from 'axios'
import {
  LoginEmailDataType,
  LoginPhoneDataType,
  LoginRequestPhoneDataType,
  LoginRequestPhoneResponse,
  RefreshTokenDataType,
  Token,
  User,
  ValidateTokenType,
} from '@/types'
import { inject, injectable } from 'inversify-props'
import { IUserService } from '@/services/interfaces'
import { AbstractApiService } from '@/services/abstractApi.service'
import { ILoggerFactory } from '@/utils/loggerFactory'

@injectable()
export class UserService extends AbstractApiService implements IUserService {
  constructor(
    @inject('AxiosService') private readonly axiosService: AxiosInstance,
    @inject('LoggerFactory') loggerFactory: ILoggerFactory
  ) {
    super(loggerFactory.createLogger('UserService'))
  }

  async loginEmail({ email, password }: LoginEmailDataType): Promise<AxiosResponse<Token>> {
    this.logger.beginScope('loginEmail')

    try {
      return await this.apiErrorHandler(
        this.axiosService.post<Token>('/user/login-email', { email, password })
      )
    } finally {
      this.logger.endScope()
    }
  }
  async loginRequestPhone({ phone }: LoginRequestPhoneDataType): Promise<AxiosResponse<LoginRequestPhoneResponse>> {
    this.logger.beginScope('loginRequestPhone')

    try {
      return await this.apiErrorHandler(
        this.axiosService.post<LoginRequestPhoneResponse>('/user/login-request-phone', { phone })
      )
    } finally {
      this.logger.endScope()
    }
  }
  async loginPhone({ phone, code }: LoginPhoneDataType): Promise<AxiosResponse<Token>> {
    this.logger.beginScope('loginPhone', '@[phone], code - @[code]', { phone, code })

    try {
      return await this.apiErrorHandler(
        this.axiosService.post<Token>('/user/login-phone', { phone, code })
      )
    } finally {
      this.logger.endScope()
    }
  }
  async refreshToken({ id, token }: RefreshTokenDataType): Promise<AxiosResponse<Token>> {
    this.logger.beginScope('refreshToken')

    try {
      return await this.apiErrorHandler(
        this.axiosService.post<Token>('/user/refresh-token', { id, token })
      )
    } finally {
      this.logger.endScope()
    }
  }
  async validateToken(token: string): Promise<AxiosResponse<ValidateTokenType>> {
    this.logger.beginScope('validateToken')

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<ValidateTokenType>('/user/validateToken', { params: { token } })
      )
    } finally {
      this.logger.endScope()
    }
  }
  async getUserData(): Promise<AxiosResponse<User>> {
    this.logger.beginScope('getUser')

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<User>('/user')
      )
    } finally {
      this.logger.endScope()
    }
  }
}

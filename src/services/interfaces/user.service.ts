import {
  LoginEmailDataType, LoginPhoneDataType, LoginRequestPhoneDataType,
  LoginRequestPhoneResponse,
  RefreshTokenDataType,
  Token,
  User,
  ValidateTokenType,
} from '@/types'
import { AxiosResponse } from 'axios'

export interface IUserService {
  loginEmail({ email, password }: LoginEmailDataType): Promise<AxiosResponse<Token>>

  loginRequestPhone({ phone }: LoginRequestPhoneDataType): Promise<AxiosResponse<LoginRequestPhoneResponse>>

  loginPhone({ phone, code }: LoginPhoneDataType): Promise<AxiosResponse<Token>>

  refreshToken({ id, token }: RefreshTokenDataType): Promise<AxiosResponse<Token>>

  validateToken(token: string): Promise<AxiosResponse<ValidateTokenType>>

  getUserData(): Promise<AxiosResponse<User>>
}

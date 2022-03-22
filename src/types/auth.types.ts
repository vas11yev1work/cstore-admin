export interface LoginEmailDataType {
  email: string
  password: string
}

export interface LoginRequestPhoneDataType {
  phone: string
}

export interface LoginPhoneDataType {
  phone: string
  code: string
}

export interface LoginRequestPhoneResponse {
  phone: string
  useBefore: Date
}

export interface RefreshTokenDataType {
  id: number
  token: string
}

export interface Token {
  token: string
  refreshToken: {
    id: number
    token: RefreshToken
  }
}

interface RefreshToken {
  token: string
  issuedAt: Date
  ip: string
  userAgent: string
}

export interface ValidateTokenType {
  isValid: boolean
  time: number,
  timeLeft?: number
}

export type UserRefreshToken = Omit<RefreshToken, 'token'>

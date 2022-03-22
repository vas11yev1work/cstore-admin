import { UserRefreshToken } from '@/types/auth.types'

enum Role {
  USER,
  OPERATOR,
  ADMIN,
}

export interface User {
  id: number
  email: string
  emailConfirmed: boolean
  firstName: string
  lastName: string
  phone: string
  phoneConfirmed: boolean
  birthday: Date | null
  roles: Role
  refreshTokens: UserRefreshToken[]
}

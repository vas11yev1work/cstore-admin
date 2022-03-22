import { User } from '@/types/user.types'

export interface Address {
  id: number
  user?: User | null
  country: string
  city: string
  address1: string
  address2: string
  phone: string
  email: string | null
  zip: string
}

export type CreateAddress = Omit<Address, 'id' | 'user'>

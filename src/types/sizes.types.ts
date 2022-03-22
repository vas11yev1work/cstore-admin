export interface Size {
  id: number
  size: number
  sizeName: string
}

export type CreateSize = Omit<Size, 'id'>

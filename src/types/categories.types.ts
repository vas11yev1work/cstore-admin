export interface Category {
  id: number
  name: string
  picture: string
}

export type CreateCategory = Omit<Category, 'id'>

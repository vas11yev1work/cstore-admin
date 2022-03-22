import { AxiosResponse } from 'axios'
import { Category, CreateCategory } from '@/types'

export interface ICategoriesService {
  getCategories(): Promise<AxiosResponse<Category[]>>

  getCategory(id: number): Promise<AxiosResponse<Category>>

  addCategory(category: CreateCategory): Promise<AxiosResponse<Category>>

  editCategory(id: number, category: Partial<CreateCategory>): Promise<AxiosResponse<Category>>

  deleteCategory(id: number): Promise<AxiosResponse<number>>
}

import { defineStore } from 'pinia'
import { Category, CreateCategory } from '@/types'
import { ICategoriesService } from '@/services/interfaces/categories.service'
import { cid, container } from 'inversify-props'

type CategoriesState = {
  categories: Category[]
}

const categoriesService = container.get<ICategoriesService>(cid.CategoriesService)

export const useCategoriesStore = defineStore({
  id: 'categories',
  state: (): CategoriesState => ({
    categories: []
  }),
  actions: {
    async getCategories(): Promise<void> {
      try {
        const { data } = await categoriesService.getCategories()
        this.categories = data
      } catch (e) {
        throw new Error(`Произошла ошибка при получении категорий. Код: ${e.response.status}`)
      }
    },
    async addCategory(category: CreateCategory) {
      try {
        const { data } = await categoriesService.addCategory(category)
        this.categories.push(data)
        return data
      } catch (e) {
        throw new Error(`Произошла ошибка при добавлении новой категории. Код: ${e.response.status}`)
      }
    },
    async editCategory(id: number, category: Partial<CreateCategory>) {
      try {
        const { data } = await categoriesService.editCategory(id, category)
        const categories = this.categories.filter(c => c.id !== id)
        this.categories = [...categories, data]
        return data
      } catch (e) {
        throw new Error(`Произошла ошибка при обновлении категории. Код: ${e.response.status}`)
      }
    },
    async deleteCategory(id: number) {
      try {
        await categoriesService.deleteCategory(id)
        this.categories = this.categories.filter(c => c.id !== id)
      } catch (e) {
        throw new Error(`Произошла ошибка при удалении категории. Код: ${e.response.status}`)
      }
    }
  }
})

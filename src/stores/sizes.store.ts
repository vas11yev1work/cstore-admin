import { defineStore } from 'pinia'
import { Size, CreateSize } from '@/types'
import { cid, container } from 'inversify-props'
import { ISizesService } from '@/services/interfaces/sizes.service'

type SizesState = {
  sizes: Size[]
}

const sizesServices = container.get<ISizesService>(cid.SizesService)

export const useSizesStore = defineStore({
  id: 'sizes',
  state: (): SizesState => ({
    sizes: []
  }),
  actions: {
    async getSizes(): Promise<void> {
      try {
        const { data } = await sizesServices.getSizes()
        this.sizes = data
      } catch (e) {
        throw new Error(`Произошла ошибка при получении размеров. Код: ${e.response.status}`)
      }
    },
    async addSize(size: CreateSize) {
      try {
        const { data } = await sizesServices.addSize(size)
        this.sizes.push(data)
        return data
      } catch (e) {
        throw new Error(`Произошла ошибка при добавлении нового размера. Код: ${e.response.status}`)
      }
    },
    async editSize(id: number, size: Partial<CreateSize>) {
      try {
        const { data } = await sizesServices.editSize(id, size)
        const editedSize = this.sizes.filter(s => s.id !== id)
        this.sizes = [...editedSize, data]
        return data
      } catch (e) {
        throw new Error(`Произошла ошибка при обновлении размера. Код: ${e.response.status}`)
      }
    },
    async deleteSize(id: number) {
      try {
        await sizesServices.deleteSize(id)
        this.sizes = this.sizes.filter(s => s.id !== id)
      } catch (e) {
        throw new Error(`Произошла ошибка при удалении размера. Код: ${e.response.status}`)
      }
    }
  },
  getters: {
    sortedSizes(state): Size[] {
      return [...state.sizes].sort((a, b) => {
        return a.size - b.size
      })
    },
    sizeById(state): (id: number) => Size | null {
      return (id: number) => state.sizes.find(x => x.id === id) || null
    }
  }
})

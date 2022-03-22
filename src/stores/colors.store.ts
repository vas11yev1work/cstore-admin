import { defineStore } from 'pinia'
import { Color, CreateColor } from '@/types'
import { cid, container } from 'inversify-props'
import { IColorsService } from '@/services/interfaces/colors.service'

type ColorsState = {
  colors: Color[]
}

const colorsService = container.get<IColorsService>(cid.ColorsService)

export const useColorsStore = defineStore({
  id: 'colors',
  state: (): ColorsState => ({
    colors: []
  }),
  actions: {
    async getColors(): Promise<void> {
      try {
        const { data } = await colorsService.getColors()
        this.colors = data
      } catch (e) {
        throw new Error(`Произошла ошибка при получении цветов. Код: ${e.response.status}`)
      }
    },
    async addColor(color: CreateColor): Promise<Color> {
      try {
        const { data } = await colorsService.addColor(color)
        this.colors.push(data)
        return data
      } catch (e) {
        throw new Error(`Произошла ошибка при добавлении нового цвета. Код: ${e.response.status}`)
      }
    },
    async editColor(id: number, color: Partial<CreateColor>): Promise<Color> {
      try {
        const { data } = await colorsService.editColor(id, color)
        const colors = this.colors.filter(c => c.id !== id)
        this.colors = [...colors, data]
        return data
      } catch (e) {
        throw new Error(`Произошла ошибка при обновлении цвета. Код: ${e.response.status}`)
      }
    },
    async deleteColor(id: number) {
      try {
        await colorsService.deleteColor(id)
        this.colors = this.colors.filter(c => c.id !== id)
      } catch (e) {
        throw new Error(`Произошла ошибка при удалении цвета. Код: ${e.response.status}`)
      }
    }
  },
  getters: {
    sortedColors(state): Color[] {
      return [...state.colors].sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    }
  }
})

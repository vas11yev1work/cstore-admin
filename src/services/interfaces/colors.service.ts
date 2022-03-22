import { AxiosResponse } from 'axios'
import { Color, CreateColor } from '@/types'

export interface IColorsService {
  getColors(): Promise<AxiosResponse<Color[]>>

  getColor(id: number): Promise<AxiosResponse<Color>>

  addColor(color: CreateColor): Promise<AxiosResponse<Color>>

  editColor(id: number, color: Partial<CreateColor>): Promise<AxiosResponse<Color>>

  deleteColor(id: number): Promise<AxiosResponse<number>>
}

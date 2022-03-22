import { AxiosResponse } from 'axios'
import { CreateSize, Size } from '@/types'

export interface ISizesService {
  getSizes(): Promise<AxiosResponse<Size[]>>

  getSize(id: number): Promise<AxiosResponse<Size>>

  addSize(size: CreateSize): Promise<AxiosResponse<Size>>

  editSize(id: number, size: Partial<CreateSize>): Promise<AxiosResponse<Size>>

  deleteSize(id: number): Promise<AxiosResponse<number>>
}

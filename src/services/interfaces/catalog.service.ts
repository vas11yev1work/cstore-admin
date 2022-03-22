import {
  CreateCatalogItem,
  CatalogItem,
  DetailedCatalogItem,
  CreateSizeStock,
  StockData, EditedStockData,
} from '@/types'
import { AxiosResponse } from 'axios'

export interface ICatalogService {
  createCatalogItem(item: CreateCatalogItem): Promise<AxiosResponse<{ id: number }>>

  getCatalogItems(): Promise<AxiosResponse<{ count: number, data: CatalogItem[] }>>

  getCatalogItem(id: number): Promise<AxiosResponse<DetailedCatalogItem>>

  editCatalogItem(id: number, item: CreateCatalogItem): Promise<AxiosResponse<{ id: number }>>

  addCatalogItemSize(id: number, data: CreateSizeStock): Promise<AxiosResponse<StockData>>

  getCatalogItemSizes(id: number): Promise<AxiosResponse<StockData[]>>

  editCatalogItemSize(id: number, data: CreateSizeStock): Promise<AxiosResponse<EditedStockData>>

  deleteCatalogItemSize(id: number, stockId: number): Promise<AxiosResponse>
}

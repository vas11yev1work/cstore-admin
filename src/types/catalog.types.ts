import { Category, Color, Sex, Size } from '@/types'

interface CatalogItemSizeStock {
  id: number
  stock: number
}

export interface CatalogItem {
  id: number
  name: string
  description: string
  price: string
  sex: Sex,
  photos: string[]
  discount: number
  keywords: string[]
  itemCategories: Category[]
  itemColors: Color[]
  itemSizes: CatalogItemSizeStock[]
  metadata: any
  isActive: boolean
}

export interface ViewedCatalogItem {
  amount: number
  sizeId: number
  catalogItem: Omit<CatalogItem, 'keywords' | 'itemSizes' | 'isActive'>
}

type DetailedSizeStock = CatalogItemSizeStock & { itemSize: Size }

export type DetailedCatalogItem = Omit<CatalogItem, 'itemSizes'> & DetailedSizeStock

export interface CreateCatalogItem {
  name: string
  description: string
  price: string
  sex: Sex
  photos: string[]
  discount: number
  itemCategoriesIds: number[]
  itemColorsIds: number[]
  metadata: any
  isActive: boolean
}

export interface StockData {
  stock: number
  catalogItem?: Omit<CatalogItem, 'itemCategories' | 'itemColors' | 'itemSizes'>
  itemSize: Size
  id: number
}

export type EditedStockData = Pick<StockData, 'stock' | 'id'>

export interface CreateSizeStock {
  stock: number
  itemSizeId: number
}

import { AbstractApiService } from '@/services/abstractApi.service'
import { ICatalogService } from '@/services/interfaces'
import {
  CatalogItem,
  CreateCatalogItem,
  StockData,
  CreateSizeStock,
  DetailedCatalogItem, EditedStockData,
} from '@/types'
import { AxiosInstance, AxiosResponse } from 'axios'
import { inject, injectable } from 'inversify-props'
import { ILoggerFactory } from '@/utils/loggerFactory'

const CATALOG_URL = '/catalog'

@injectable()
export class CatalogService extends AbstractApiService implements ICatalogService {
  constructor(
    @inject('AxiosService') private readonly axiosService: AxiosInstance,
    @inject('LoggerFactory') loggerFactory: ILoggerFactory
  ) {
    super(loggerFactory.createLogger('CatalogService'))
  }

  async createCatalogItem(item: CreateCatalogItem): Promise<AxiosResponse<{ id: number }>> {
    this.logger.beginScope('createCatalogItem')

    try {
      return await this.apiErrorHandler(
        this.axiosService.post<{ id: number }>(CATALOG_URL, item)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async getCatalogItems(): Promise<AxiosResponse<{ count: 1, data: CatalogItem[] }>> {
    this.logger.beginScope('getCatalogItems')

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<CatalogItem[]>(CATALOG_URL)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async getCatalogItem(id: number): Promise<AxiosResponse<DetailedCatalogItem>> {
    this.logger.beginScope('getCatalogItem', '@[id]', { id })

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<DetailedCatalogItem>(`${CATALOG_URL}/${id}`)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async editCatalogItem(id: number, item: CreateCatalogItem): Promise<AxiosResponse<{ id: number }>> {
    this.logger.beginScope('editCatalogItem', '@[id]', { id })

    try {
      return await this.apiErrorHandler(
        this.axiosService.put<{ id: number }>(`${CATALOG_URL}/${id}`, item)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async addCatalogItemSize(id: number, data: CreateSizeStock): Promise<AxiosResponse<StockData>> {
    this.logger.beginScope('addCatalogItemSize')

    try {
      return await this.apiErrorHandler(
        this.axiosService.post(`${CATALOG_URL}/${id}/sizes`, data)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async getCatalogItemSizes(id: number): Promise<AxiosResponse<StockData[]>> {
    this.logger.beginScope('getCatalogItemSizes', '@[id]', { id })

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<StockData>(`${CATALOG_URL}/${id}/sizes`)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async editCatalogItemSize(id: number, data: CreateSizeStock): Promise<AxiosResponse<EditedStockData>> {
    this.logger.beginScope('editCatalogItemSize', '@[id]', { id: data.itemSizeId })

    try {
      return await this.apiErrorHandler(
        this.axiosService.put<EditedStockData>(`${CATALOG_URL}/${id}/sizes/${data.itemSizeId}`, { stock: data.stock })
      )
    } finally {
      this.logger.endScope()
    }
  }

  async deleteCatalogItemSize(id: number, stockId: number): Promise<AxiosResponse> {
    this.logger.beginScope('deleteCatalogItemSize', 'Stock: @[id]', { id: stockId })

    try {
      return await this.apiErrorHandler(
        this.axiosService.delete(`${CATALOG_URL}/${id}/sizes/${stockId}`)
      )
    } finally {
      this.logger.endScope()
    }
  }
}

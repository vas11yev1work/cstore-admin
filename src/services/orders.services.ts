import { AbstractApiService } from '@/services/abstractApi.service'
import { IOrdersService } from '@/services/interfaces'
import { inject, injectable } from 'inversify-props'
import { AxiosInstance, AxiosResponse } from 'axios'
import { ILoggerFactory } from '@/utils/loggerFactory'
import { OrderDelivery, CreateFastOrderData, ListAllParams, OrderData, OrderFullData } from '@/types'

@injectable()
export class OrdersService extends AbstractApiService implements IOrdersService {
  constructor(
    @inject('AxiosService') private readonly axiosService: AxiosInstance,
    @inject('LoggerFactory') loggerFactory: ILoggerFactory
  ) {
    super(loggerFactory.createLogger('OrdersService'))
  }

  async createManualOrder(order: CreateFastOrderData): Promise<AxiosResponse<any>> {
    this.logger.beginScope('createManualOrder')

    try {
      return await this.apiErrorHandler(
        this.axiosService.post('/order/create-manual-order', order)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async getFastCode(id: number): Promise<AxiosResponse<string>> {
    this.logger.beginScope('getFastCode')

    try {
      return await this.apiErrorHandler(
        this.axiosService.get(`/order/${id}/get-fast-code`)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async addDelivery(id: number, data: OrderDelivery): Promise<AxiosResponse> {
    this.logger.beginScope('addDelivery', '@[id]', { id })

    try {
      return await this.apiErrorHandler(
        this.axiosService.post(`/order/${id}/add-delivery`, data)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async getOrdersList(params: ListAllParams): Promise<AxiosResponse<{ count: number, data: OrderData[]}>> {
    this.logger.beginScope('getOrdersList')

    try {
      return await this.apiErrorHandler(
        this.axiosService.post('/order/list-all', params)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async getOrderData(id: number): Promise<AxiosResponse<OrderFullData>> {
    this.logger.beginScope('getOrderData', '@[id]', { id })

    try {
      return await this.apiErrorHandler(
        this.axiosService.get(`/order/${id}`)
      )
    } finally {
      this.logger.endScope()
    }
  }
}

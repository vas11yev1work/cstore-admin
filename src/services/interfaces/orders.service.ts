import { AxiosResponse } from 'axios'
import { OrderDelivery, CreateFastOrderData, ListAllParams, OrderData, OrderFullData } from '@/types'

export interface IOrdersService {
  createManualOrder(order: CreateFastOrderData): Promise<AxiosResponse<any>>

  getFastCode(id: number): Promise<AxiosResponse<string>>

  addDelivery(id: number, data: OrderDelivery): Promise<AxiosResponse>

  getOrdersList(params: ListAllParams): Promise<AxiosResponse<{ count: number, data: OrderData[]}>>

  getOrderData(id: number): Promise<AxiosResponse<OrderFullData>>
}

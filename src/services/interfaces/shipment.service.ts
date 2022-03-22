import { AxiosResponse } from 'axios'
import { EstimateShipment, ShipmentVariant } from '@/types'

export interface IShipmentService {
  estimateShipping(data: EstimateShipment): Promise<AxiosResponse<ShipmentVariant[]>>

  getShipmentsList(): Promise<AxiosResponse<string[]>>
}

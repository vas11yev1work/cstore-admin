import { AbstractApiService } from '@/services/abstractApi.service'
import { IShipmentService } from '@/services/interfaces'
import { EstimateShipment, ShipmentVariant } from '@/types'
import { AxiosInstance, AxiosResponse } from 'axios'
import { inject, injectable } from 'inversify-props'
import { ILoggerFactory } from '@/utils/loggerFactory'

const SHIPMENT_URL = '/shipment'

@injectable()
export class ShipmentService extends AbstractApiService implements IShipmentService {
  constructor(
    @inject('AxiosService') private readonly axiosService: AxiosInstance,
    @inject('LoggerFactory') loggerFactory: ILoggerFactory
  ) {
    super(loggerFactory.createLogger('ShipmentService'))
  }

  async estimateShipping(data: EstimateShipment): Promise<AxiosResponse<ShipmentVariant[]>> {
    this.logger.beginScope('estimateShipping')

    try {
      return await this.apiErrorHandler(
        this.axiosService.post<ShipmentVariant[]>(`${SHIPMENT_URL}/estimate`, data)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async getShipmentsList(): Promise<AxiosResponse<string[]>> {
    this.logger.beginScope('getShipmentsList')

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<string[]>(`${SHIPMENT_URL}`)
      )
    } finally {
      this.logger.endScope()
    }
  }
}

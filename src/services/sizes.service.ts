import { CreateSize, Size } from '@/types'
import { AxiosInstance, AxiosResponse } from 'axios'
import { ISizesService } from '@/services/interfaces'
import { inject, injectable } from 'inversify-props'
import { ILoggerFactory } from '@/utils/loggerFactory'
import { AbstractApiService } from '@/services/abstractApi.service'

const SIZES_URL = '/item-size'

@injectable()
export class SizesService extends AbstractApiService implements ISizesService {
  constructor(
    @inject('AxiosService') private readonly axiosService: AxiosInstance,
    @inject('LoggerFactory') loggerFactory: ILoggerFactory
  ) {
    super(loggerFactory.createLogger('SizesService'))
  }

  async getSizes(): Promise<AxiosResponse<Size[]>> {
    this.logger.beginScope('getSizes')

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<Size[]>(SIZES_URL)
      )
    } finally {
      this.logger.endScope()
    }
  }
  async getSize(id: number): Promise<AxiosResponse<Size>> {
    this.logger.beginScope('getSize', '@[id]', { id })

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<Size>(`${SIZES_URL}/${id}`)
      )
    } finally {
      this.logger.endScope()
    }
  }
  async addSize(size: CreateSize): Promise<AxiosResponse<Size>> {
    this.logger.beginScope('addSize')

    try {
      return await this.apiErrorHandler(
        this.axiosService.post<Size>(SIZES_URL, size)
      )
    } finally {
      this.logger.endScope()
    }
  }
  async editSize(id: number, size: Partial<CreateSize>): Promise<AxiosResponse<Size>> {
    this.logger.beginScope('editSize', '@[id], @[size]', { id, size: size.sizeName })

    try {
      return await this.apiErrorHandler(
        this.axiosService.put<Size>(`${SIZES_URL}/${id}`, size)
      )
    } finally {
      this.logger.endScope()
    }
  }
  async deleteSize(id: number): Promise<AxiosResponse<number>> {
    this.logger.beginScope('deleteSize', '@[id]', { id })

    try {
      return await this.apiErrorHandler(
        this.axiosService.delete<number>(`${SIZES_URL}/${id}`)
      )
    } finally {
      this.logger.endScope()
    }
  }
}

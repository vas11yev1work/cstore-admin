import { Color, CreateColor } from '@/types'
import { AxiosInstance, AxiosResponse } from 'axios'
import { IColorsService } from '@/services/interfaces'
import { inject, injectable } from 'inversify-props'
import { AbstractApiService } from '@/services/abstractApi.service'
import { ILoggerFactory } from '@/utils/loggerFactory'

const COLORS_URL = '/item-color'

@injectable()
export class ColorsService extends AbstractApiService implements IColorsService {
  constructor(
    @inject('AxiosService') private readonly axiosService: AxiosInstance,
    @inject('LoggerFactory') loggerFactory: ILoggerFactory
  ) {
    super(loggerFactory.createLogger('ColorsService'))
  }

  async getColors(): Promise<AxiosResponse<Color[]>> {
    this.logger.beginScope('getColors')

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<Color[]>(COLORS_URL)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async getColor(id: number): Promise<AxiosResponse<Color>> {
    this.logger.beginScope('getColor', '@[id]', { id })

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<Color>(`${COLORS_URL}/${id}`)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async addColor(color: CreateColor): Promise<AxiosResponse<Color>> {
    this.logger.beginScope('addColor', '', color)
    try {
      return await this.apiErrorHandler(
        this.axiosService.post<Color>(COLORS_URL, color)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async editColor(id: number, color: Partial<CreateColor>): Promise<AxiosResponse<Color>> {
    this.logger.beginScope('editColor', '@[id], @[color]', { id, color: color.name })
    try {
      return this.apiErrorHandler(
        this.axiosService.put<Color>(`${COLORS_URL}/${id}`, color)
      )
    } finally {
      this.logger.endScope()
    }
  }

  async deleteColor(id: number): Promise<AxiosResponse<number>> {
    this.logger.beginScope('deleteColor', '@[id]', { id })

    try {
      return await this.apiErrorHandler(
        this.axiosService.delete<number>(`${COLORS_URL}/${id}`)
      )
    } finally {
      this.logger.endScope()
    }
  }
}

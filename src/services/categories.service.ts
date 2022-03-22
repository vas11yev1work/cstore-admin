import { Category, CreateCategory } from '@/types'
import { AxiosInstance, AxiosResponse } from 'axios'
import { ICategoriesService } from '@/services/interfaces'
import { inject, injectable } from 'inversify-props'
import { ILoggerFactory } from '@/utils/loggerFactory'
import { AbstractApiService } from '@/services/abstractApi.service'

const CATEGORIES_URL = '/item-category'

@injectable()
export class CategoriesService extends AbstractApiService implements ICategoriesService {
  constructor(
    @inject('AxiosService') private readonly axiosService: AxiosInstance,
    @inject('LoggerFactory') loggerFactory: ILoggerFactory
  ) {
    super(loggerFactory.createLogger('CategoriesService'))
  }

  async getCategories(): Promise<AxiosResponse<Category[]>> {
    this.logger.beginScope('getCategories')

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<Category[]>(CATEGORIES_URL)
      )
    } finally {
      this.logger.endScope()
    }
  }
  async getCategory(id: number): Promise<AxiosResponse<Category>> {
    this.logger.beginScope('getCategory', '@[id]', { id })

    try {
      return await this.apiErrorHandler(
        this.axiosService.get<Category>(`${CATEGORIES_URL}/${id}`)
      )
    } finally {
      this.logger.endScope()
    }
  }
  async addCategory(category: CreateCategory): Promise<AxiosResponse<Category>> {
    this.logger.beginScope('addCategory')

    try {
      return await this.apiErrorHandler(
        this.axiosService.post<Category>(CATEGORIES_URL, category)
      )
    } finally {
      this.logger.endScope()
    }
  }
  async editCategory(id: number, category: Partial<CreateCategory>): Promise<AxiosResponse<Category>> {
    this.logger.beginScope('editCategory', '@[id], @[category]', { id, category: category.name })

    try {
      return await this.apiErrorHandler(
        this.axiosService.put<Category>(`${CATEGORIES_URL}/${id}`, category)
      )
    } finally {
      this.logger.endScope()
    }
  }
  async deleteCategory(id: number): Promise<AxiosResponse<number>> {
    this.logger.beginScope('delete', '@[id]', { id })

    try {
      return await this.apiErrorHandler(
        this.axiosService.delete<number>(`${CATEGORIES_URL}/${id}`)
      )
    } finally {
      this.logger.endScope()
    }
  }
}

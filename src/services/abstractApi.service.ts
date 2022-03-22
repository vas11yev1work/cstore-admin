import { AxiosResponse } from 'axios'
import { ILogger } from '@/utils'

export abstract class AbstractApiService {
  protected constructor(protected readonly logger: ILogger) {}

  protected async apiErrorHandler<T>(req: Promise<AxiosResponse>): Promise<AxiosResponse<T>> {
    try {
      this.logger.logInfo('Performing axios request')
      return await req
    } catch (e) {
      this.logger.logError('@[stack]', { stack: e.stack })
      if (e.response) {
      // Тут мы можем преобразовать ошибки api в наши Error и делать по необходимости свою логику обработки
      /* switch (e.response.status) {
           case 400:
             throw new InvalidRequestError(e.response.data)
             break
           case 401:
             throw new AuthError(e.response.data)
             break
           case 403:
             throw new ForbiddenError(e.response.data)
             break
           case 404:
             throw new NotFoundError(e.response.data)
             break
           case 429:
             throw new RateLimitError(e.response.data)
             break
           case 500:
             throw new InternalError(e.response.data)
             break
           default:
             throw new ApiError(e.response.data)
         }
       */

      } else if (e.request) {
       // throw new NetworkError('AXIOS_NO_RESPONSE')
      } else {
       //throw new NetworkError('AXIOS_INTERNAL')
      }
      throw e
    } finally {
      this.logger.logInfo('Performing request performed')
    }
  }
}

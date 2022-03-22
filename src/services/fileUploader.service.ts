import { AbstractApiService } from '@/services/abstractApi.service'
import { IFileUploader } from '@/services/interfaces'
import { inject } from 'inversify-props'
import { AxiosInstance, AxiosResponse } from 'axios'
import { ILoggerFactory } from '@/utils/loggerFactory'

export class FileUploaderService extends AbstractApiService implements IFileUploader {
  constructor(
    @inject('AxiosService') private readonly axiosService: AxiosInstance,
    @inject('LoggerFactory') loggerFactory: ILoggerFactory
  ) {
    super(loggerFactory.createLogger('FileUploaderService'))
  }

  async upload(files: Array<File>, err?: (i: number) => void, progress?: (e: ProgressEvent) => void): Promise<AxiosResponse<Array<string>>> {
    this.logger.beginScope('upload')
    try {
      const formData = new FormData()
      for (const [index, file] of files.entries()) {
        formData.append(`file[${index}]`, file, file.name)
      }
      const response = await this.apiErrorHandler<Array<string>>(
        this.axiosService.post('/fileUploader/uploadFile', formData, {
          onUploadProgress: progress
        })
      )
      if (err) {
        response.data.forEach((file, i) => {
          if (file === 'INVALID_FILE') {
            err(i)
          }
        })
      }
      return response
    } finally {
      this.logger.endScope()
    }
  }
}

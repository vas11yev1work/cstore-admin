import { AxiosResponse } from 'axios'

export interface IFileUploader {
  upload(files: Array<File>, err?: (i: number) => void, progress?: (e: ProgressEvent) => void): Promise<AxiosResponse<Array<string>>>
}

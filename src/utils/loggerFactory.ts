import { ILogger } from '@/utils/logger'
import { ConsoleLogger } from '@/utils/services/console-logger.service'

export interface ILoggerFactory {
  createLogger(serviceName: string): ILogger;
}

export class ConsoleLoggerFactory implements ILoggerFactory{
  createLogger(serviceName: string): ILogger {
    return new ConsoleLogger(serviceName)
  }
}

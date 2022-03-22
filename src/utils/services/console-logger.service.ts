import { ILogger, IScope } from '@/utils'

export class ConsoleLogger implements ILogger {
  private readonly mode: string
  private readonly serviceName: string
  private readonly scopes: IScope[];

  constructor(serviceName?: string) {
    this.mode = process.env.NODE_ENV
    this.serviceName = serviceName || 'NONE'
    this.scopes = []
  }


  logError(message: string, data: Record<string, string> = {}): void {
    console.error(this.getFullScopeString() + ConsoleLogger.formatMessage(message, data))
  }

  logInfo(message: string, data: Record<string, string> = {}): void {
    console.info(this.getFullScopeString() + ConsoleLogger.formatMessage(message, data))
  }

  private static formatMessage(message = '', templateData: Record<string, string>): string {
    let scopeMessage = message || ''
    const matches = scopeMessage.match(/(?<=@\[)(.*?)(?=\])/g)

    if (!matches) return scopeMessage || ''

    for (const match of new Set(matches)) {
      scopeMessage = scopeMessage.replaceAll(`@[${match}]`, templateData[match])
    }
    return scopeMessage
  }

  private getFullScopeString(): string {
    let message = this.serviceName
    for (const scope of this.scopes) {
      if (scope.message?.length)
        message += ` -> | [${scope.scope}]: ${ConsoleLogger.formatMessage(scope.message, scope.templateData)} | `
      else
        message += ` -> | [${scope.scope}] | `
    }
    return message
  }


  beginScope(scope: string): void;
  beginScope(scope: string, message: string, data: Record<string, any>): void;
  beginScope(scope: string, message?: string, data?: Record<string, any>): void {
    this.scopes.push({
      scope: scope,
      message,
      templateData: data || {}
    })
  }

  endScope(): void {
    this.scopes.pop()
  }
}

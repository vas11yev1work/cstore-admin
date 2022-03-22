export interface IScope {
  scope: string;
  message?: string;
  templateData: Record<string, any>;
}

export interface ILogger {
  logInfo: (message: string, data?: Record<string, any>) => void
  logError: (message: string, data?: Record<string, any>) => void
  beginScope(scope: string): void
  beginScope(scope: string, message: string, data: Record<string, any>): void
  endScope(): void
}

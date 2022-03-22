export type ToastType = 'primary' | 'success' | 'warning' | 'danger' | 'black'

export interface ToastMessage {
  id: number,
  text: string
  type?: ToastType,
  timeout?: number
}

export type CreateToastMessage = Omit<ToastMessage, 'id'>

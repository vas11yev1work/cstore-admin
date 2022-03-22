import { DeliveryType, OrderPaymentStatus, OrderStatus, PaymentMethod, Sex } from '@/types'

export function wordTypes(n: number, textForms: Array<string>) {
  const num = Math.abs(n) % 100
  const n1 = num % 10
  if (num > 10 && num < 20) return textForms[2]
  if (n1 > 1 && n1 < 5) return textForms[1]
  if (n1 == 1) return textForms[0]
  return textForms[2]
}

export function toBase64(file: File) {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export function imageRetry(e: Event) {
  const target = e.target as HTMLImageElement
  const originalSrc = target.src
  const dataRetry = parseInt(target.getAttribute('data-retry') || '0', 10)
  const dataMaxRetry = parseInt(target.getAttribute('data-max-retry') || '7', 10)

  if (dataRetry !== dataMaxRetry) {
    target.setAttribute('data-retry', `${dataRetry + 1}`)

    target.src = require('../assets/loader.svg')

    setTimeout(() => {
      target.src = originalSrc
    }, 2000)
  } else {
    target.src = require('../assets/loader.svg')
  }
}

export function getSex(sex: Sex) {
  switch (sex) {
    case Sex.Unisex:
      return 'Унисекс'
    case Sex.Male:
      return 'Мужской'
    case Sex.Female:
      return 'Женский'
  }
}

export function getShipmentVariant(v: DeliveryType) {
  switch (v) {
    case DeliveryType.Courier:
      return 'Курьер'
    case DeliveryType.Office:
      return 'Постамат'
    case DeliveryType.PickPoint:
      return 'Пункт выдачи'
  }
}

export function getShipmentProvider(v: string) {
  switch (v) {
    case 'ozon':
      return 'Ozon Rocket'
    default:
      return 'Unknown'
  }
}

export function getPaymentMethod(v: PaymentMethod) {
  switch (v) {
    case PaymentMethod.YooMoney:
      return 'ЮMoney'
    case PaymentMethod.PayOnDelivery:
      return 'Оплата при получении'
    case PaymentMethod.None:
      return 'Не указан'
  }
}

export function getOrderStatus(v: OrderStatus) {
  switch (v) {
    case OrderStatus.CREATED:
      return {
        value: 'Создан',
        color: 'green'
      }
    case OrderStatus.WAITING_FOR_PAYMENT:
      return {
        value: 'Ожидает оплаты',
        color: 'red'
      }
    case OrderStatus.PROCESSING:
      return {
        value: 'В работе',
        color: 'blue'
      }
    case OrderStatus.WAITING_FOR_SHIPPING:
      return {
        value: 'Ожидает отправки',
        color: 'yellow'
      }
    case OrderStatus.SHIPPING:
      return {
        value: 'Передан в доставку',
        color: 'yellow'
      }
    case OrderStatus.WAITING_FOR_PICKUP:
      return {
        value: 'Ожидает получения',
        color: 'blue'
      }
    case OrderStatus.FINISHED:
      return {
        value: 'Доставлен',
        color: 'green'
      }
    case OrderStatus.CANCELED:
      return {
        value: 'Отменен',
        color: 'red'
      }
  }
}

export function getOrderPaymentStatus(v: OrderPaymentStatus) {
  switch (v) {
    case OrderPaymentStatus.NotPaid:
      return {
        value: OrderPaymentStatus.NotPaid,
        color: 'red'
      }
    case OrderPaymentStatus.Paid:
      return {
        value: OrderPaymentStatus.Paid,
        color: 'green'
      }
    case OrderPaymentStatus.PartiallyPaid:
      return {
        value: OrderPaymentStatus.PartiallyPaid,
        color: 'blue'
      }
  }
}

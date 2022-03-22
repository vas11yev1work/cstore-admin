export enum Constants {
  UnknownError = 'Произошла непредвиденная ошибка'
}

export enum Sex {
  Male = 'male',
  Female = 'female',
  Unisex = 'unisex'
}

export enum PaymentMethod {
  None = 'none',
  YooMoney = 'yoomoney',
  PayOnDelivery = 'pay_on_delivery'
}

export enum DeliveryMethod {
  RussianPost = 'RussianPost',
  RocketOzon = 'RocketOzon',
  Courier = 'Courier'
}

export enum OrderPaymentStatus {
  NotPaid = 'Не оплачен',
  Paid = 'Оплачен',
  PartiallyPaid = 'Частично оплачен'
}

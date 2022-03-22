export enum DeliveryType {
  Courier = 'courier',
  Office = 'office',
  PickPoint = 'pickpoint'
}

export interface EstimateShipment {
  address: string
  shipmentProvider: string
}

export interface ShipmentVariant {
  price: number
  deliveryType: DeliveryType
  deliveryTermInDays: number
}

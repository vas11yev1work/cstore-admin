import {
  CreateAddress,
  PaymentMethod,
  DeliveryMethod,
  CreateCatalogItem,
  DeliveryType,
  Address,
} from '@/types'

interface Entities {
  itemColors: number[]
  itemCategories: number[]
}

export type CatalogItemAttributes = Omit<
  CreateCatalogItem,
  'isActive' | 'itemColorsIds' | 'itemCategoriesIds'
  > & Entities

export interface FastOrderItemAttributes {
  amount: number | string
  sizeId: number
  photosData: Array<File>
  photosList: Array<{
    img: string
    order: number
  }>
  catalogItem: CatalogItemAttributes
}

export type CreateFastOrderItemAttributes = Omit<FastOrderItemAttributes, 'photosData' | 'photosList'>

export interface CreateFastOrderData {
  address: CreateAddress
  paymentMethod: PaymentMethod
  deliveryMethod: DeliveryMethod
  items: CreateFastOrderItemAttributes[]
}

export interface OrderDelivery {
  deliveryMethod: DeliveryType
  deliveryProvider: string
  price: string
}

export interface ListAllParams {
  take: number
  page: number
  filters: {
    status: string[]
  }
}

export interface OrderData {
  id: number
  address: Omit<Address, 'user'>
  status: OrderStatus
  paymentMethod: PaymentMethod
  deliveryMethod: DeliveryMethod
  trackCode: string
  paid: string
  openedAt: string
  paymentInformation: PaymentInformation | null
  total: string
}

export interface PaymentInformation {
  amount: {
    currency: string
    value: string
  }
  cancellation_details: CancellationDetails | null
  confirmation: {
    confirmation_url: string
    type: string
  }
  id: string
  lastUpdatedAt: string
  status: string
}

interface CancellationDetails {
  party: string
  reason: string
}

interface OrderStatusHistoryEntry {
  date: string;
  status: OrderStatus;
  action: OrderAction;
  metadata: any;
  comment: string;
}

export interface OrderItemAttributes {
  itemType: ItemsType
}

export type OrderFullData = OrderData & {
  history: OrderStatusHistoryEntry[]
  items: any[]
}

export enum ItemsType {
  DeliveryOrderItem = 'DeliveryOrderItem',
  CatalogOrderItem = 'CatalogOrderItem'
}

export enum OrderStatus {
  CREATED = 'created',
  WAITING_FOR_PAYMENT = 'waiting_for_payment',
  PROCESSING = 'processing',
  WAITING_FOR_SHIPPING = 'waiting_for_shipping',
  SHIPPING = 'shipping',
  WAITING_FOR_PICKUP = 'waiting_for_pickup',
  FINISHED = 'finished',
  CANCELED = 'canceled',
}

export enum OrderAction {
  NONE = 'none',
  ADD_ITEMS = 'add_items',
  REMOVE_ITEMS = 'remove_items',
  CHANGE_INFO = 'change_info',
  PAYMENT_CREATED = 'payment_created',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAIL = 'payment_fail',
}

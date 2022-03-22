import { defineStore } from 'pinia'
import { cid, container } from 'inversify-props'
import { IShipmentService } from '@/services/interfaces'

type ShipmentsState = {
  shipmentsList: string[]
}

const shipmentService = container.get<IShipmentService>(cid.ShipmentService)

export const useShipmentsStore = defineStore({
  id: 'shipments',
  state: (): ShipmentsState => ({
    shipmentsList: []
  }),
  actions: {
    async getShipmentsList(): Promise<void> {
      try {
        const { data } = await shipmentService.getShipmentsList()
        this.shipmentsList = data
      } catch (e) {
        throw new Error(`Произошла ошибка при вариантов доставки. Код: ${e.response.status}`)
      }
    }
  }
})

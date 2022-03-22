<template>
  <page :title="`Заказ #${$route.params.id}`" style="margin-bottom: 30px;">
    <template #header>
      <h3 v-if="orderData" class="total">Стоимость заказа: <b>{{ orderData.total || 0 }}₽</b></h3>
    </template>
    <main-table
      :header="orderListTableHeader"
      :rows="orderListTableData"
      no-left
      no-right
      no-bottom
      @row-click="navigateToCatalogItem($event.item.cells[0].content.id)"
      :loading="loading"
    />
  </page>
  <div class="order-blocks">
    <page class="block" title="Доставка">
      <main-table :rows="addressTableData" no-right no-left no-bottom />
    </page>
    <page class="block" title="Платежные данные">
      <main-table :rows="paymentTableData" no-right no-left no-bottom>
        <template #cell="{ cell }">
          <status :color="cell.content.color" v-if="cell.id === 'status'">
            {{ cell.title }}
          </status>
          <template v-else>{{ cell.title }}</template>
        </template>
      </main-table>
    </page>
    <page class="block" title="Контакты">
      <main-table :rows="contactsTableData" no-right no-left no-bottom />
    </page>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import Page from '@/elements/Page.vue'
import { useRoute, useRouter } from 'vue-router'
import { cid, container } from 'inversify-props'
import { IOrdersService } from '@/services/interfaces'
import { useToastsStore } from '@/stores/toasts.store'
import {
  ItemsType,
  OrderDelivery,
  OrderFullData,
  OrderItemAttributes,
  OrderPaymentStatus,
  ViewedCatalogItem,
} from '@/types'
import MainTable from '@/components/UI/Table/MainTable.vue'
import { TableHeader, TableRow } from '@/components/UI/Table/table.types'
import { useSizesStore } from '@/stores/sizes.store'
import { useLoaderStore } from '@/stores/loader.store'
import { storeToRefs } from 'pinia'
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js/mobile'
import { getOrderPaymentStatus, getShipmentProvider } from '@/utils'
import Status from '@/components/UI/Status.vue'

const orderService = container.get<IOrdersService>(cid.OrdersService)

export default defineComponent({
  name: 'OrderView',
  components: { MainTable, Page, Status },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toastsStore = useToastsStore()
    const sizesStore = useSizesStore()
    const loaderStore = useLoaderStore()

    const orderData = ref<OrderFullData | null>(null)

    const { loading } = storeToRefs(loaderStore)

    const id = computed(() => {
      return route.params.id as string
    })

    const orderListTableHeader: TableHeader[] = [
      { name: '#', width: 1 },
      { name: 'Название' },
      { name: 'Размер' },
      { name: 'Цена' },
      { name: 'Количество' },
      { name: 'Стоимость' },
    ]

    const orderListTableData = computed<TableRow[]>(() => {
      return [
        ...catalogItems.value.map((item, i) => {
          return {
            id: i,
            cells: [
              { id: 'index', title: i + 1, content: { id: item.catalogItem.id } },
              { id: 'name', title: item.catalogItem.name },
              { id: 'size', title: sizesStore.sizeById(item.sizeId)?.sizeName || '-' },
              { id: 'price', title: `${+item.catalogItem.price}₽` },
              { id: 'amount', title: `${item.amount} шт.` },
              { id: 'total', title: `${+item.catalogItem.price * item.amount}₽` }
            ]
          }
        }),
        {
          id: 'price',
          cells: [
            { id: 'index', title: '' },
            { id: 'name', title: '' },
            { id: 'size', title: '' },
            { id: 'price', title: '' },
            { id: 'amount', title: '' },
            {
              id: 'total',
              title: `Итого: ${priceWithoutDelivery.value}₽`
            },
          ]
        }
      ]
    })

    const deliveryOrderItem = computed<OrderItemAttributes & OrderDelivery | null>(() => {
      return orderData.value?.items.find(
        x => x.itemType === ItemsType.DeliveryOrderItem
      ) || null as OrderItemAttributes & OrderDelivery | null
    })

    const catalogItems = computed<(ViewedCatalogItem & OrderItemAttributes)[]>(() => {
      return orderData.value?.items.filter(
        x => x.itemType === ItemsType.CatalogOrderItem
      ) || [] as (ViewedCatalogItem & OrderItemAttributes)[]
    })

    const address = computed(() => {
      if (orderData.value) {
        return orderData.value.address
      }
      return null
    })

    const priceWithoutDelivery = computed(() => {
      return (orderData.value ? +orderData.value.total : 0)
        - (deliveryOrderItem.value ? +deliveryOrderItem.value.price : 0)
    })

    const paymentTableData = computed<TableRow[]>(() => {
      return [
        {
          cells: [
            { title: 'Статус оплаты' },
            {
              id: 'status',
              title: paymentStatus.value.value,
              content: {
                color: paymentStatus.value.color
              }
            },
          ]
        },
        {
          cells: [
            { title: 'Сумма заказа' },
            { title: `${priceWithoutDelivery.value}₽` }
          ]
        },
        {
          cells: [
            { title: 'Доставка' },
            { title: `${deliveryOrderItem.value ? +deliveryOrderItem.value.price : 0}₽` }
          ]
        },
        {
          cells: [
            { title: 'Итоговая сумма' },
            { title: `${orderData.value ? +orderData.value.total : 0}₽` }
          ]
        },
        {
          cells: [
            { title: 'Оплачено' },
            { title: `${orderData.value ? +orderData.value.paid : 0}₽` }
          ]
        },
      ]
    })

    const contactsTableData = computed<TableRow[]>(() => {
      const phone = address.value?.phone || '-'
      const internationalPhone = isValidPhoneNumber(phone, 'RU') ? parsePhoneNumber(phone).formatNational() : '-'
      return [
        {
          cells: [
            { title: 'Телефон' },
            { title: internationalPhone }
          ]
        },
        {
          cells: [
            { title: 'Email' },
            { title: address.value?.email || '-' }
          ]
        }
      ]
    })

    const addressTableData = computed<TableRow[]>(() => {
      return [
        {
          cells: [
            { title: 'Страна' },
            { title: address.value?.country || '-' }
          ]
        },
        {
          cells: [
            { title: 'Город' },
            { title: address.value?.city || '-' }
          ]
        },
        {
          cells: [
            { title: 'Адрес' },
            { title: address.value ? `${address.value.address1}${address.value.address2 ? `, ${address.value.address2}` : ''}` : '-' }
          ]
        },
        {
          cells: [
            { title: 'Индекс' },
            { title: address.value?.zip || '-' }
          ]
        },
        {
          cells: [
            { title: 'Служба' },
            { title: getShipmentProvider(deliveryOrderItem.value?.deliveryProvider || '-') }
          ]
        }
      ]
    })

    const paymentStatus = computed(() => {
      if (orderData.value) {
        const paid = orderData.value ? +orderData.value.paid : 0
        const total = orderData.value ? +orderData.value.total : 0

        if (paid === 0) {
          return getOrderPaymentStatus(OrderPaymentStatus.NotPaid)
        } else if (paid === total) {
          return getOrderPaymentStatus(OrderPaymentStatus.Paid)
        } else {
          return getOrderPaymentStatus(OrderPaymentStatus.PartiallyPaid)
        }
      }
      return getOrderPaymentStatus(OrderPaymentStatus.NotPaid)
    })

    function navigateToCatalogItem(id: number) {
      if (id > 0) {
        router.push({ name: 'EditCatalogItem', params: { id } })
      }
    }

    async function getOrderData() {
      try {
        const { data } = await orderService.getOrderData(+id.value)
        orderData.value = data
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ Произошла ошибка при получении заказа. Код: ${e.response.status}`
        })
      }
    }

    onBeforeMount(() => {
      getOrderData()
    })

    return {
      orderData,
      deliveryOrderItem,
      catalogItems,
      orderListTableHeader,
      orderListTableData,
      navigateToCatalogItem,
      loading,
      paymentTableData,
      contactsTableData,
      addressTableData
    }
  }
})
</script>

<style lang="scss" scoped>
.order-blocks {
  display: flex;
  .block {
    margin-right: 30px;
    height: fit-content;
    &:last-child {
      margin-right: 0;
    }
  }
}
.total {
  font-size: 16px;
  font-weight: 500;
  b {
    color: $cs-primary;
  }
}
</style>

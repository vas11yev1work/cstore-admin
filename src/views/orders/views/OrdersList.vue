<template>
  <page title="Список заказов">
    <main-table
      :header="tableHeader"
      :rows="tableData"
      no-left
      no-right
      :loading="ordersLoading"
      @row-click="$router.push({ name: 'OrderView', params: { id: $event.item.cells[0].title } })"
    >
      <template #cell="{ cell }">
        <status v-if="cell.id === 'status'" :color="cell.content.color">
          {{ cell.title }}
        </status>
        <template v-else>
          {{ cell.title }}
        </template>
      </template>
    </main-table>
    <div class="pagination-block" v-if="count > 0">
      <pagination v-model:page="page" v-if="count > +take" :count="count" :take="+take" style="margin-right: 15px;" />
      <div class="fake" v-else />
      <main-select v-model="take" small :items="takeItems" id="take" style="width: 60px;" />
    </div>
  </page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { cid, container } from 'inversify-props'
import { IOrdersService } from '@/services/interfaces'
import { useToastsStore } from '@/stores/toasts.store'
import { OrderData } from '@/types'
import Page from '@/elements/Page.vue'
import MainTable from '@/components/UI/Table/MainTable.vue'
import { TableHeader, TableRow } from '@/components/UI/Table/table.types'
import dayjs from 'dayjs'
import { getOrderStatus, getPaymentMethod } from '@/utils'
import Status from '@/components/UI/Status.vue'
import Pagination from '@/components/UI/Pagination.vue'
import MainSelect from '@/components/UI/MainSelect.vue'

const orderService = container.get<IOrdersService>(cid.OrdersService)

export default defineComponent({
  name: 'OrdersList',
  components: { Pagination, Page, MainTable, Status, MainSelect },
  setup() {
    const toastsStore = useToastsStore()
    const take = ref('10')
    const page = ref(1)
    const count = ref(0)
    const ordersLoading = ref(false)
    const takeItems = [
      { title: '10', value: '10' },
      { title: '15', value: '15' },
      { title: '25', value: '25' },
    ]

    const orders = ref<OrderData[]>([])

    const tableHeader: TableHeader[] = [
      { name: '#', width: 1 },
      { name: 'Дата' },
      { name: 'Город доставки' },
      { name: 'Способ оплаты' },
      { name: 'Оплачено' },
      { name: 'Стоимость' },
      { name: 'Статус' }
    ]

    watch(() => page.value, () => {
      loadOrders()
    }, { immediate: true })

    watch(() => take.value, () => {
      if (page.value === 1) {
        loadOrders()
      }
      page.value = 1
    })

    const tableData = computed<TableRow[]>(() => {
      return orders.value.map((order, i) => {
        return {
          id: i,
          cells: [
            { id: 'index', title: order.id },
            { id: 'date', title: dayjs(order.openedAt).format('DD MMMM YYYY,  HH:mm:ss').toString() },
            { id: 'city', title: order.address.city },
            { id: 'payment', title: getPaymentMethod(order.paymentMethod) },
            { id: 'paid', title: `${order.paid}₽` },
            { id: 'total', title: `${order.total}₽` },
            { id: 'status', title: getOrderStatus(order.status).value, content: { color: getOrderStatus(order.status).color } },
          ]
        }
      })
    })

    async function loadOrders() {
      try {
        if (ordersLoading.value) return
        orders.value = []
        ordersLoading.value = true
        const { data } = await orderService.getOrdersList({
          take: +take.value,
          page: page.value - 1,
          filters: {
            status: []
          }
        })
        orders.value = data.data
        count.value = data.count
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ Произошла ошибка при получении списка заказов. Код: ${e.response.status}`
        })
      } finally {
        ordersLoading.value = false
      }
    }

    return {
      orders,
      tableHeader,
      tableData,
      ordersLoading,
      page,
      count,
      take,
      takeItems
    }
  }
})
</script>

<style lang="scss" scoped>
.pagination-block {
  display: flex;
  justify-content: space-between;
  padding: 15px 18px;
}
</style>

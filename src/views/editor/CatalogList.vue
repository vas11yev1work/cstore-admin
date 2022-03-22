<template>
  <page title="Список товаров">
    <template #header>
      <main-button @click="$router.push({ name: 'CreateCatalogItem' })">
        Новый товар
      </main-button>
    </template>
    <main-table
      @row-click="editItem"
      :header="tableHeader"
      :rows="items"
      no-right
      no-left
      no-bottom
    >
      <template #cell="{ cell }">
        <template v-if="cell.id === 'item'">
          <div class="catalog-item-name-wrap">
            <img :src="cell.content.img" class="catalog-item-photo" alt="photo">
            <span class="catalog-item-name">{{ cell.title }}</span>
          </div>
        </template>
        <template v-else-if="cell.id === 'settings'">
          <div class="settings-wrap">
            <icon-button
              icon="list_alt"
              color="success"
              :disabled="loading"
              style="margin-right: 7px;"
              @click="$router.push({ name: 'CatalogItemSizes', params: { id: cell.content.id } })"
            />
            <icon-button icon="settings" />
          </div>
        </template>
        <template v-else>
          {{ cell.title }}
        </template>
      </template>
    </main-table>
  </page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import Page from '@/elements/Page.vue'
import MainButton from '@/components/UI/MainButton.vue'
import { cid, container } from 'inversify-props'
import { ICatalogService } from '@/services/interfaces'
import { useToastsStore } from '@/stores/toasts.store'
import { CatalogItem } from '@/types'
import { TableHeader, TableRow } from '@/components/UI/Table/table.types'
import MainTable from '@/components/UI/Table/MainTable.vue'
import { getSex } from '@/utils'
import { useRouter } from 'vue-router'
import IconButton from '@/components/UI/IconButton.vue'
import { useLoaderStore } from '@/stores/loader.store'
import { storeToRefs } from 'pinia'

const catalogServices = container.get<ICatalogService>(cid.CatalogService)

export default defineComponent({
  name: 'CatalogList',
  components: { IconButton, Page, MainButton, MainTable },
  setup() {
    const toastsStore = useToastsStore()
    const loaderStore = useLoaderStore()
    const router = useRouter()

    const { loading } = storeToRefs(loaderStore)

    const catalog = ref<CatalogItem[]>([])

    const tableHeader: TableHeader[] = [
      { name: 'Название' },
      { name: 'Пол' },
      { name: 'Цвет' },
      { name: 'Остаток' },
      { name: 'Статус' },
      { name: 'Цена', position: 'right' },
      { name: '', position: 'right' },
    ]

    const items = computed<TableRow[]>(() => {
      return catalog.value.map<TableRow>((item, i) => {
        return {
          id: i,
          cells: [
            { id: 'item', title: item.name, content: { img: item.photos[0], id: item.id } },
            { id: 'sex', title: getSex(item.sex) },
            { id: 'color', title: item.itemColors[0]?.name || '-' },
            { id: 'count', title: `${item.itemSizes.reduce((acc, v) => acc + v.stock, 0)} шт.` },
            { id: 'status', title: item.isActive ? 'Опубликовано' : 'Не опубликовано' },
            { id: 'price', title: `${item.price}₽` },
            { id: 'settings', title: 'settings', content: { id: item.id } },
          ]
        }
      })
    })

    function editItem({ item }: { index: 0, item: TableRow }) {
      const id = item.cells.find(x => x.id === 'item')?.content?.id || null
      if (id) {
        router.push({ name: 'EditCatalogItem', params: { id } })
      }
    }

    onMounted(async () => {
      try {
        const { data } = await catalogServices.getCatalogItems()
        catalog.value = data.data
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ Произошла ошибка при получении списка товаров. Код: ${e.response.status}`
        })
      }
    })

    return { items, tableHeader, catalog, editItem, loading }
  }
})
</script>

<style lang="scss" scoped>
.catalog-item-name-wrap {
  display: flex;
  align-items: center;
  .catalog-item-photo {
    height: 32px;
    width: 32px;
    display: flex;
    border: 1px solid $cs-border;
    margin-right: 10px;
  }
}
.settings-wrap {
  display: flex;
  justify-content: flex-end;
}
</style>

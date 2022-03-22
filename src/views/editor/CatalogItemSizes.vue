<template>
  <page title="Редактирование позиций">
    <template #header>
      <main-button @click="openModal(false)">
        Добавить размер
      </main-button>
    </template>
    <main-table
      :header="tableHeader"
      :rows="items"
      no-bottom
      no-left
      no-right
    >
      <template #cell="{ cell }">
        <template v-if="cell.id === 'settings'">
          <div class="settings-wrap">
            <icon-button
              icon="add"
              color="warning"
              :disabled="loading"
              style="margin-right: 7px;"
              @click="openModal(true, String(cell.content.id))"
            />
            <icon-button icon="delete" color="danger" @click="deleteSize(cell.content.stockId)" />
          </div>
        </template>
        <template v-else>
          {{ cell.title }}
        </template>
      </template>
    </main-table>
  </page>
  <modal :show="modalState" title="Добавление размера" @close="closeModal">
    <info-text v-if="selectedSize && isEdit">Размер: {{ allSizes.find(x => x.id === +selectedSize).sizeName }}</info-text>
    <main-select v-if="!isEdit" v-model="selectedSize" :items="unusedSizeForSelect" style="margin-bottom: 10px;" id="size" :disabled="loading" />
    <text-field v-model:text="stock" type="number" :disabled="loading" style="margin-bottom: 10px;" placeholder="Количество" />
    <main-button fill block :disabled="!selectedSize || loading" @click="sizeHandler">
      Создать
    </main-button>
  </modal>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import Page from '@/elements/Page.vue'
import MainButton from '@/components/UI/MainButton.vue'
import { useRoute } from 'vue-router'
import { cid, container } from 'inversify-props'
import { ICatalogService } from '@/services/interfaces'
import { useToastsStore } from '@/stores/toasts.store'
import { StockData, Size } from '@/types'
import { TableHeader, TableRow } from '@/components/UI/Table/table.types'
import MainTable from '@/components/UI/Table/MainTable.vue'
import IconButton from '@/components/UI/IconButton.vue'
import Modal from '@/components/UI/Modal.vue'
import { useSizesStore } from '@/stores/sizes.store'
import { storeToRefs } from 'pinia'
import MainSelect from '@/components/UI/MainSelect.vue'
import { useLoaderStore } from '@/stores/loader.store'
import InfoText from '@/components/UI/InfoText.vue'
import TextField from '@/components/UI/TextField.vue'

const catalogServices = container.get<ICatalogService>(cid.CatalogService)

export default defineComponent({
  name: 'CatalogItemSizes',
  components: { TextField, Page, MainButton, MainTable, IconButton, Modal, MainSelect, InfoText },
  setup() {
    const route = useRoute()
    const toastsStore = useToastsStore()
    const sizesStore = useSizesStore()
    const loaderStore = useLoaderStore()

    const { loading } = storeToRefs(loaderStore)
    const { sortedSizes: allSizes } = storeToRefs(sizesStore)

    const sizes = ref<StockData[]>([])
    const isEdit = ref(false)
    const modalState = ref(false)
    const selectedSize = ref('')
    const stock = ref('')

    const usedSizes = computed<Size[]>(() => {
      return sizes.value.map(x => {
        return x.itemSize
      })
    })

    const unusedSizes = computed<Size[]>(() => {
      return allSizes.value.filter(x => !usedSizes.value.find(s => s.id === x.id))
    })

    const unusedSizeForSelect = computed(() => {
      return [
        { title: 'Выберите размер', value: '', disabled: true},
        ...unusedSizes.value.map(x => {
          return {
            title: x.sizeName,
            value: String(x.id)
          }
        })
      ]
    })

    const id = computed(() => {
      return +route.params.id || -1
    })

    const tableHeader: TableHeader[] = [
      { name: 'Размер' },
      { name: 'Остаток' },
      { name: '', position: 'right' },
    ]

    const items = computed<TableRow[]>(() => {
      return sizes.value.map<TableRow>((item, i) => {
        return {
          id: i,
          cells: [
            { id: 'sizeName', title: item.itemSize.sizeName },
            { id: 'stock', title: `${item.stock} шт.` },
            {
              id: 'settings',
              title: 'settings',
              content: { id: String(item.itemSize.id), stockId: item.id }
            }
          ]
        }
      })
    })

    function closeModal() {
      stock.value = ''
      selectedSize.value = ''
      isEdit.value = false
      modalState.value = false
    }

    function openModal(edit: boolean, id?: string) {
      if (edit && id) {
        selectedSize.value = id
      }
      isEdit.value = edit
      modalState.value = true
    }

    async function sizeHandler() {
      try {
        if (isEdit.value) {
          const editedStockDataId = sizes.value.find(x => x.itemSize.id === +selectedSize.value)?.id
          if (!editedStockDataId) return
          const { data } = await catalogServices.editCatalogItemSize(id.value, { stock: +stock.value, itemSizeId: editedStockDataId })
          sizes.value[sizes.value.findIndex(x => x.id === data.id)].stock = data.stock
        } else {
          const { data } = await catalogServices.addCatalogItemSize(id.value, { stock: +stock.value, itemSizeId: +selectedSize.value })
          sizes.value.push(data)
          closeModal()
        }
        toastsStore.$show(`✨ Позиции успешно ${isEdit.value ? 'обновлены' : 'созданы'}!`)
        closeModal()
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ Произошла ошибка при ${isEdit.value ? 'редактировании' : ' добавлении'} позиции. Код: ${e.response.status}`
        })
      }
    }

    async function deleteSize(stockId: number) {
      try {
        const answer = confirm('Вы действительно хотите удалить позицию?')
        if (answer) {
          await catalogServices.deleteCatalogItemSize(id.value, stockId)
          const index = sizes.value.findIndex(x => x.id === stockId)
          sizes.value.splice(index, 1)
        }
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ Произошла ошибка при удалении позиции. Код: ${e.response.status}`
        })
      }
    }

    onMounted(async () => {
      try {
        const { data } = await catalogServices.getCatalogItemSizes(id.value)
        sizes.value = data
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ Произошла ошибка при получении списка товаров. Код: ${e.response.status}`
        })
      }
    })

    return {
      loading,
      stock,
      tableHeader,
      items,
      isEdit,
      modalState,
      closeModal,
      openModal,
      selectedSize,
      unusedSizeForSelect,
      sizeHandler,
      allSizes,
      deleteSize
    }
  }
})
</script>

<style lang="scss" scoped>
.settings-wrap {
  display: flex;
  justify-content: flex-end;
}
</style>

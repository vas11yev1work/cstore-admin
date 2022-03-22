<template>
  <page title="Список размеров">
    <template #header>
      <main-button :disabled="loading" @click="openSizeModal">
        Новый размер
      </main-button>
    </template>
    <main-table
      @row-click="openSizeModal(true, $event.item.cells[3]?.content?.id || -1)"
      :header="tableHeader"
      :rows="sizes"
      no-left
      no-right
      no-bottom
    >
      <template #cell="{ cell }">
        <template v-if="['index', 'name', 'size'].includes(cell.id)">
          {{ cell.title }}
        </template>
        <div class="cell-actions" v-else>
          <icon-button
            @click="openSizeModal(true, cell?.content?.id || -1)"
            :disabled="loading"
            style="margin-right: 7px;"
            color="success"
            icon="edit"
          />
          <icon-button
            @click="openDeletionModal(cell?.content?.id || -1)"
            :disabled="loading"
            color="danger"
            icon="delete"
          />
        </div>
      </template>
    </main-table>
  </page>
  <modal
    @close="closeSizeModal"
    width="340px"
    :title="form.edit ? 'Изменить размер' : 'Добавить размер'"
    :show="sizeModalState"
  >
    <text-field
      v-model:text="form.sizeName"
      id="size-name"
      class="modal-field"
      placeholder="Название размера"
      :disabled="loading"
    />
    <text-field
      v-model:text="form.size"
      id="size-value"
      class="modal-field"
      type="number"
      placeholder="Размер"
      :disabled="loading"
    />
    <main-button @click="sizeAction" :disabled="sizeActionDisable" fill block>
      {{ form.edit ? 'Изменить' : 'Добавить' }}
    </main-button>
  </modal>
  <modal
    @close="closeDeletionModal"
    width="340px"
    title="Удалить размер"
    :show="deletionModalState"
  >
    <info-text>
      Вы действительно хотите удалить размер "<b>{{ editedSize?.sizeName }}</b>"?
    </info-text>
    <info-text>
      Введите "<b>{{ editedSize?.sizeName }}</b>", чтобы подтвердить удаление
    </info-text>
    <text-field
      id="size-confirm-deletion"
      :disabled="loading"
      :placeholder="editedSize?.sizeName"
      v-model:text="form.confirmDeletionSizeText"
      style="margin-bottom: 15px;"
    />
    <main-button
      :disabled="deletionDisable"
      color="danger"
      fill
      block
      @click="deleteSize"
    >
      Удалить размер
    </main-button>
  </modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import Page from '@/elements/Page.vue'
import MainButton from '@/components/UI/MainButton.vue'
import MainTable from '@/components/UI/Table/MainTable.vue'
import IconButton from '@/components/UI/IconButton.vue'
import Modal from '@/components/UI/Modal.vue'
import TextField from '@/components/UI/TextField.vue'
import InfoText from '@/components/UI/InfoText.vue'
import { TableHeader, TableRow } from '@/components/UI/Table/table.types'
import { useSizesStore } from '@/stores/sizes.store'
import { useToastsStore } from '@/stores/toasts.store'
import { storeToRefs } from 'pinia'
import { Size } from '@/types'
import { useLoaderStore } from '@/stores/loader.store'

type FormType = {
  size: string
  sizeName: string
  edit: boolean
  editedId: number
  confirmDeletionSizeText: string
}

export default defineComponent({
  name: 'Sizes',
  components: {
    InfoText,
    TextField,
    Page,
    Modal,
    MainButton,
    MainTable,
    IconButton,
  },
  setup() {
    const sizesStore = useSizesStore()
    const toastsStore = useToastsStore()
    const loaderStore = useLoaderStore()

    const { loading } = storeToRefs(loaderStore)

    const sizeModalState = ref(false)
    const deletionModalState = ref(false)

    const form = reactive<FormType>({
      size: '',
      sizeName: '',
      edit: false,
      editedId: -1,
      confirmDeletionSizeText: ''
    })

    const tableHeader: TableHeader[] = [
      { name: '#', width: 1 },
      { name: 'Название' },
      { name: 'Размер', position: 'center' },
      { name: 'Действия', position: 'right' }
    ]

    const sizeActionDisable = computed(() => {
      return !form.sizeName.trim() || !form.size.trim() || loading.value
    })

    const deletionDisable = computed(() => {
      return form.confirmDeletionSizeText !== editedSize.value?.sizeName || loading.value
    })

    const { sortedSizes } = storeToRefs(sizesStore)

    const sizes = computed<TableRow[]>(() => {
      return sortedSizes.value.map<TableRow>((size, i) => {
        return {
          id: i,
          cells: [
            { id: 'index', title: i + 1 },
            { id: 'name', title: size.sizeName },
            { id: 'size', title: size.size },
            { id: 'action', title: 'action', content: { id: size.id } }
          ]
        }
      })
    })

    const editedSize = computed<Size | null>(() => {
      return sortedSizes.value.find((s: Size) => s.id === form.editedId) || null
    })

    function clearSizes() {
      form.sizeName = ''
      form.size = '0'
      form.editedId = -1
      form.edit = false
      form.confirmDeletionSizeText = ''
    }

    function openDeletionModal(id: number) {
      deletionModalState.value = true
      form.editedId = id
    }

    function closeDeletionModal() {
      deletionModalState.value = false
      clearSizes()
    }

    function openSizeModal(isEdit = false, id = -1) {
      form.edit = isEdit
      sizeModalState.value = true
      if (isEdit) {
        const currentSize = sortedSizes.value.find(c => c.id === id)
        form.editedId = id
        if (currentSize) {
          form.sizeName = currentSize.sizeName
          form.size = String(currentSize.size)
        }
      }
    }

    function closeSizeModal() {
      sizeModalState.value = false
      clearSizes()
    }

    async function editSize() {
      const editedSizeData = await sizesStore.editSize(form.editedId, {
        sizeName: form.sizeName,
        size: +form.size
      })
      toastsStore.$show(`✨ ${editedSizeData.size} размер успешно изменен!`)
    }

    async function addSize() {
      const newSizeData = await sizesStore.addSize({
        sizeName: form.sizeName,
        size: +form.size
      })
      toastsStore.$show(`✨ ${newSizeData.size} размер успешно добавлен!`)
    }

    async function deleteSize() {
      try {
        await sizesStore.deleteSize(form.editedId)
        toastsStore.$show('✨ Цвет успешно удален!')
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ ${e.message}`
        })
      } finally {
        closeDeletionModal()
      }
    }

    async function sizeAction() {
      try {
        if (form.edit) {
          await editSize()
          return
        }
        await addSize()
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ ${e.message}`
        })
      } finally {
        closeSizeModal()
      }
    }

    return {
      form,
      sizes,
      loading,
      editedSize,
      tableHeader,
      sizeModalState,
      deletionModalState,
      deleteSize,
      sizeAction,
      openSizeModal,
      closeSizeModal,
      openDeletionModal,
      closeDeletionModal,
      sizeActionDisable,
      deletionDisable
    }
  }
})
</script>

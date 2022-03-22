<template>
  <page title="Список цветов">
    <template #header>
      <main-button :disabled="loading" @click="openColorModal">
        Новый цвет
      </main-button>
    </template>
    <main-table
      @row-click="openColorModal(true, $event.item.cells[3]?.content?.id || -1)"
      :header="tableHeader"
      :rows="colors"
      no-bottom
      no-left
      no-right
    >
      <template #cell="{ cell }">
        <template v-if="['index', 'name'].includes(cell.id)">
          {{ cell.title }}
        </template>
        <div class="color-cell" v-else-if="cell.id === 'color'">
          <div class="color" :style="{ backgroundColor: cell.title }" />
          <span class="color-name">{{ cell.title }}</span>
        </div>
        <div class="cell-actions" v-else>
          <icon-button
            @click="openColorModal(true, cell?.content?.id || -1)"
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
    @close="closeColorModal"
    width="340px"
    :title="form.edit ? 'Изменить цвет' : 'Добавить цвет'"
    :show="colorModalState"
  >
    <text-field
      v-model:text="form.colorName"
      id="color-name"
      class="modal-field"
      placeholder="Название цвета"
      :disabled="loading"
    />
    <input v-model="form.color" :disabled="loading" class="color-picker modal-field" type="color" />
    <main-button @click="colorAction" :disabled="colorActionDisable" fill block>
      {{ form.edit ? 'Изменить' : 'Добавить' }}
    </main-button>
  </modal>
  <modal
    @close="closeDeletionModal"
    width="340px"
    title="Удалить цвет"
    :show="deletionModalState"
  >
    <info-text>
      Вы действительно хотите удалить <b>{{ editedColor?.name.toLowerCase() }}</b> цвет?
    </info-text>
    <info-text>
      Введите "<b>{{ editedColor?.name.toLowerCase() }}</b>", чтобы подтвердить удаление
    </info-text>
    <text-field
      id="color-confirm-deletion"
      :placeholder="editedColor?.name.toLowerCase()"
      :disabled="loading"
      v-model:text="form.confirmDeletionColorText"
      style="margin-bottom: 15px;"
    />
    <main-button
      :disabled="deletionDisable"
      color="danger"
      fill
      block
      @click="deleteColor"
    >
      Удалить цвет
    </main-button>
  </modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import Page from '@/elements/Page.vue'
import { useColorsStore } from '@/stores/colors.store'
import { storeToRefs } from 'pinia'
import Modal from '@/components/UI/Modal.vue'
import MainButton from '@/components/UI/MainButton.vue'
import TextField from '@/components/UI/TextField.vue'
import MainTable from '@/components/UI/Table/MainTable.vue'
import IconButton from '@/components/UI/IconButton.vue'
import { TableHeader, TableRow } from '@/components/UI/Table/table.types'
import { useToastsStore } from '@/stores/toasts.store'
import { Color } from '@/types'
import InfoText from '@/components/UI/InfoText.vue'
import { useLoaderStore } from '@/stores/loader.store'

type FormType = {
  colorName: string
  color: string
  edit: boolean
  editedId: number
  confirmDeletionColorText: string
}

export default defineComponent({
  name: 'Colors',
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
    const colorsStore = useColorsStore()
    const toastsStore = useToastsStore()
    const loaderStore = useLoaderStore()

    const { loading } = storeToRefs(loaderStore)
    
    const colorModalState = ref(false)
    const deletionModalState = ref(false)

    const form = reactive<FormType>({
      colorName: '',
      color: '#FFFFFF',
      edit: false,
      editedId: -1,
      confirmDeletionColorText: ''
    })

    const tableHeader: TableHeader[] = [
      { name: '#', width: 1 },
      { name: 'Название' },
      { name: 'Цвет' },
      { name: 'Действия', position: 'right' }
    ]

    const colorActionDisable = computed(() => {
      return !form.colorName.trim() || loading.value
    })

    const deletionDisable = computed(() => {
      return form.confirmDeletionColorText !== editedColor.value?.name.toLowerCase() || loading.value
    })

    const { sortedColors } = storeToRefs(colorsStore)

    const colors = computed<TableRow[]>(() => {
      return sortedColors.value.map<TableRow>((color, i) => {
        return {
          id: i,
          cells: [
            { id: 'index', title: i + 1 },
            { id: 'name', title: color.name },
            { id: 'color', title: color.color },
            { id: 'action', title: 'action', content: { id: color.id } }
          ]
        }
      })
    })

    const editedColor = computed<Color | null>(() => {
      return sortedColors.value.find((c: Color) => c.id === form.editedId) || null
    })

    function clearColors() {
      form.colorName = ''
      form.color = '#FFFFFF'
      form.editedId = -1
      form.edit = false
      form.confirmDeletionColorText = ''
    }

    function openDeletionModal(id: number) {
      deletionModalState.value = true
      form.editedId = id
    }

    function closeDeletionModal() {
      deletionModalState.value = false
      clearColors()
    }

    function openColorModal(isEdit = false, id = -1) {
      form.edit = isEdit
      colorModalState.value = true
      if (isEdit) {
        const currentColor = sortedColors.value.find(c => c.id === id)
        form.editedId = id
        if (currentColor) {
          form.colorName = currentColor.name
          form.color = currentColor.color
        }
      }
    }

    function closeColorModal() {
      colorModalState.value = false
      clearColors()
    }

    async function editColor() {
      const editedColorData = await colorsStore.editColor(form.editedId, {
        name: form.colorName,
        color: form.color
      })
      toastsStore.$show(`✨ ${editedColorData.name} цвет успешно изменен!`)
    }

    async function addColor() {
      const newColorData = await colorsStore.addColor({
        name: form.colorName,
        color: form.color
      })
      toastsStore.$show(`✨ ${newColorData.name} цвет успешно добавлен!`)
    }

    async function deleteColor() {
      try {
        await colorsStore.deleteColor(form.editedId)
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

    async function colorAction() {
      try {
        if (form.edit) {
          await editColor()
          return
        }
        await addColor()
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ ${e.message}`
        })
      } finally {
        closeColorModal()
      }
    }

    return {
      form,
      colors,
      loading,
      tableHeader,
      editedColor,
      colorModalState,
      deletionModalState,
      deleteColor,
      colorAction,
      openColorModal,
      closeColorModal,
      openDeletionModal,
      closeDeletionModal,
      colorActionDisable,
      deletionDisable
    }
  }
})
</script>

<style lang="scss" scoped>
.color-picker {
  width: 100%;
  height: 40px;
  border: none;
  background-color: $cs-border;
  border-radius: 3px
}
.color-cell {
  display: flex;
  align-items: center;
  .color {
    height: 14px;
    width: 14px;
    border: 1px solid $cs-border;
    margin-right: 7px;
    border-radius: 50%;
  }
  .color-name {
    font-size: 14px;
    text-transform: uppercase;
  }
}
</style>

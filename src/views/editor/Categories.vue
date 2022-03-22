<template>
  <page title="Список категорий">
    <template #header>
      <main-button :disabled="loading" @click="openCategoryModal">
        Новая категория
      </main-button>
    </template>
    <main-table
      @row-click="openCategoryModal(true, $event.item.cells[2]?.content?.id || -1)"
      :header="tableHeader"
      :rows="categories"
      no-bottom
      no-left
      no-right
    >
      <template #cell="{ cell }">
        <template v-if="['index', 'name'].includes(cell.id)">
          {{ cell.title }}
        </template>
        <div class="cell-actions" v-else>
          <icon-button
            @click="openCategoryModal(true, cell?.content?.id || -1)"
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
    @close="closeCategoryModal"
    width="340px"
    :title="form.edit ? 'Изменить категорию' : 'Добавить категорию'"
    :show="categoryModalState"
  >
    <text-field
      v-model:text="form.category"
      id="category-name"
      class="modal-field"
      placeholder="Название категории"
      :disabled="loading"
    />
    <file-uploader
      v-model:files="form.picturesData"
      class="uploader"
      show-names
      show-percentage
      multiple
      :percentage="form.percentage"
    />
    <img v-if="currentPicture" class="preview" :src="currentPicture" alt="picture">
    <main-button @click="categoryAction" :disabled="categoryActionDisable" fill block>
      {{ form.edit ? 'Изменить' : 'Добавить' }}
    </main-button>
  </modal>
  <modal
    @close="closeDeletionModal"
    width="340px"
    title="Удалить категорию"
    :show="deletionModalState"
  >
    <info-text>
      Вы действительно хотите удалить категорию "<b>{{ editedCategory?.name.toLowerCase() }}</b>"?
    </info-text>
    <info-text>
      Введите "<b>{{ editedCategory?.name.toLowerCase() }}</b>", чтобы подтвердить удаление
    </info-text>
    <text-field
      id="category-confirm-deletion"
      :disabled="loading"
      :placeholder="editedCategory?.name.toLowerCase()"
      v-model:text="form.confirmDeletionCategoryText"
      style="margin-bottom: 15px;"
    />
    <main-button
      :disabled="deletionDisable"
      color="danger"
      fill
      block
      @click="deleteCategory"
    >
      Удалить категорию
    </main-button>
  </modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import Page from '@/elements/Page.vue'
import MainButton from '@/components/UI/MainButton.vue'
import { TableHeader, TableRow } from '@/components/UI/Table/table.types'
import MainTable from '@/components/UI/Table/MainTable.vue'
import IconButton from '@/components/UI/IconButton.vue'
import { useCategoriesStore } from '@/stores/categories.store'
import { storeToRefs } from 'pinia'
import { useToastsStore } from '@/stores/toasts.store'
import { Category } from '@/types'
import TextField from '@/components/UI/TextField.vue'
import Modal from '@/components/UI/Modal.vue'
import InfoText from '@/components/UI/InfoText.vue'
import { useLoaderStore } from '@/stores/loader.store'
import FileUploader from '@/elements/FileUploader.vue'
import { toBase64 } from '@/utils'
import { container, cid } from 'inversify-props'
import { IFileUploader } from '@/services/interfaces'

type FormType = {
  category: string
  edit: boolean
  editedId: number
  picturesData: Array<File>
  picture: string
  percentage: string
  confirmDeletionCategoryText: string
  uploadedPicture: string | ArrayBuffer | null
}

const fileUploaderService = container.get<IFileUploader>(cid.FileUploaderService)

export default defineComponent({
  name: 'Categories',
  components: {
    FileUploader,
    MainTable,
    MainButton,
    Page,
    IconButton,
    TextField,
    Modal,
    InfoText
  },
  setup() {
    const categoriesStore = useCategoriesStore()
    const toastsStore = useToastsStore()
    const loaderStore = useLoaderStore()

    const categoryModalState = ref(false)
    const deletionModalState = ref(false)

    const form = reactive<FormType>({
      category: '',
      edit: false,
      editedId: -1,
      picturesData: [],
      picture: '',
      percentage: '',
      confirmDeletionCategoryText: '',
      uploadedPicture: null
    })

    const { loading } = storeToRefs(loaderStore)

    const tableHeader: TableHeader[] = [
      { name: '#', width: 1 },
      { name: 'Название' },
      { name: 'Действия', position: 'right' }
    ]

    const categoryActionDisable = computed(() => {
      const defaultCondition = !form.category.trim() || loading.value
      if (form.edit) {
        return defaultCondition || !form.picture
      }
      return defaultCondition || !form.picturesData[0]
    })

    const deletionDisable = computed(() => {
      return form.confirmDeletionCategoryText !== editedCategory.value?.name.toLowerCase() || loading.value
    })

    const { categories: categoriesList } = storeToRefs(categoriesStore)

    const categories = computed<TableRow[]>(() => {
      return categoriesList.value.map<TableRow>((category, i) => {
        return {
          id: i,
          cells: [
            { id: 'index', title: i + 1 },
            { id: 'name', title: category.name },
            { id: 'action', title: 'action', content: { id: category.id } }
          ]
        }
      })
    })

    const editedCategory = computed<Category | null>(() => {
      return categoriesList.value.find((c: Category) => c.id === form.editedId) || null
    })

    const currentPicture = computed(() => {
      return form.uploadedPicture || form.picture || null
    })

    function clearCategories() {
      form.category = ''
      form.edit = false
      form.editedId = -1
      form.picturesData = []
      form.picture = ''
      form.percentage = ''
      form.confirmDeletionCategoryText = ''
      form.uploadedPicture = null
    }

    function openDeletionModal(id: number) {
      deletionModalState.value = true
      form.editedId = id
    }

    function closeDeletionModal() {
      deletionModalState.value = false
      clearCategories()
    }

    function openCategoryModal(isEdit = false, id = -1) {
      form.edit = isEdit
      categoryModalState.value = true
      if (isEdit) {
        const currentCategory = categoriesList.value.find(c => c.id === id)
        form.editedId = id
        if (currentCategory) {
          form.category = currentCategory.name
          form.picture = currentCategory.picture
        }
      }
    }

    function closeCategoryModal() {
      categoryModalState.value = false
      clearCategories()
    }

    async function editCategory() {
      const editedCategoryData = await categoriesStore.editCategory(form.editedId, {
        name: form.category,
        picture: form.picture
      })
      toastsStore.$show(`✨ Категория "${editedCategoryData.name.toLowerCase()}" успешно изменена!`)
    }

    async function addCategory() {
      const newCategoryData = await categoriesStore.addCategory({
        name: form.category,
        picture: form.picture
      })
      toastsStore.$show(`✨ Категория "${newCategoryData.name.toLowerCase()}" успешно добавлена!`)
    }

    async function deleteCategory() {
      try {
        await categoriesStore.deleteCategory(form.editedId)
        toastsStore.$show('✨ Категория успешно удалена!')
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ ${e.message}`
        })
      } finally {
        closeDeletionModal()
      }
    }

    function getPercentage(e: ProgressEvent): void {
      form.percentage = `${(e.loaded / e.total * 100).toFixed(0)}%`
    }

    function uploaderErrors(index: number) {
      toastsStore.$show({
        type: 'danger',
        text: `⛔ Ошибка при загрузке файла: ${index + 1}`
      })
    }

    async function uploadFiles() {
      const { data } = await fileUploaderService.upload(form.picturesData, uploaderErrors, getPercentage)
      if (data.length > 0) form.picture = `https://cdn.4be.site/${data[0]}`
    }

    async function categoryAction() {
      try {
        if (form.picturesData.length > 0) {
          await uploadFiles()
        }
        if (form.edit) {
          await editCategory()
          return
        }
        await addCategory()
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ ${e.message}`
        })
      } finally {
        closeCategoryModal()
      }
    }

    watch(() => form.picturesData, async () => {
      if (form.picturesData.length > 0) {
        form.uploadedPicture = await toBase64(form.picturesData[0])
      }
    })

    return {
      form,
      loading,
      categories,
      tableHeader,
      editedCategory,
      categoryModalState,
      deletionModalState,
      deleteCategory,
      categoryAction,
      openCategoryModal,
      closeCategoryModal,
      openDeletionModal,
      closeDeletionModal,
      deletionDisable,
      categoryActionDisable,
      currentPicture
    }
  }
})
</script>

<style lang="scss" scoped>
.image-preview {
  width: 300px;
  border: 1px solid $cs-border;
  display: flex;
  margin-bottom: 10px;
}
.uploader {
  margin-bottom: 10px;
}
.preview {
  width: 100%;
  height: 100%;
  display: flex;
  margin-bottom: 10px;
  border: 1px solid $cs-border;
}
</style>

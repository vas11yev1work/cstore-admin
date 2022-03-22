<template>
  <page style="margin-bottom: 20px;" :title="isEdit ? 'Редактировать товар' : 'Добавить новый товар'">
    <div class="content">
      <div class="block main-data-block">
        <text-field class="field" id="item-name" v-model:text="form.name" label="Название" :disabled="loading" />
        <text-field class="field" id="description" v-model:text="form.description" label="Описание" :disabled="loading" />
        <text-field class="field" id="price" type="number" v-model:text="form.price" label="Цена, ₽" :disabled="loading" />
        <text-field class="field" id="discount" type="number" v-model:text="form.discount" label="Скидка, ₽" :disabled="loading" />
        <main-select class="field" id="payment" v-model="form.sex" :items="sexItems" label="Пол" :disabled="loading" />
      </div>
      <div class="block">
        <h4 class="block-title">Изображения</h4>
        <draggable
          class="item-photos"
          tag="transition-group"
          :component-data="{
            tag: 'ul',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null
          }"
          v-model="form.photos"
          v-bind="{ animation: 200 }"
          @start="drag = true"
          @end="drag = false"
          item-key="order"
        >
          <template #item="{ element }">
            <li class="item-photo-wrap" v-if="element.img !== 'button'">
              <button class="delete-photo" @click="deletePhoto(element.order)">
                <m-icon icon="close" font-size="18px" />
              </button>
              <img class="item-photo" alt="photo" :src="element.img" @error="waitAndReload">
            </li>
          </template>
          <template #footer>
            <file-uploader
              v-model:files="form.photosData"
              text="Добавить"
              class="uploader"
              multiple
              show-button-percentage
              :percentage="form.percentage"
              key="uploader"
              @upload="uploadPhotos"
              :disabled="loading"
            />
          </template>
        </draggable>
      </div>
      <div class="block">
        <h4 class="block-title">Цвета</h4>
        <div class="properties">
          <button
            class="property"
            v-for="color in colors"
            :key="color.id"
            :class="{ active: form.colorsIds.includes(color.id) }"
            @click="selectColor(color.id)"
            :disabled="loading"
          >
            {{ color.name }}
          </button>
        </div>
      </div>
      <div class="block">
        <h4 class="block-title">Категории</h4>
        <div class="properties">
          <button
            class="property"
            v-for="category in categories"
            :key="category.id"
            :class="{ active: form.categoriesIds.includes(category.id) }"
            @click="selectCategory(category.id)"
            :disabled="loading"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>
  </page>
  <box class="publish-catalog-item">
    <main-button :disabled="cantCreate || loading" fill @click="catalogItemAction" class="add-catalog-item">
      {{ isEdit ? 'Редактировать товар' : 'Добавить новый товар' }}
    </main-button>
    <checkbox v-model:checked="form.publish" :disabled="loading" id="publish" value="publish">
      Опубликовать товар на сайте
    </checkbox>
  </box>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import Page from '@/elements/Page.vue'
import TextField from '@/components/UI/TextField.vue'
import MIcon from '@/components/UI/MIcon.vue'
import { useColorsStore } from '@/stores/colors.store'
import { useCategoriesStore } from '@/stores/categories.store'
import { storeToRefs } from 'pinia'
import MainButton from '@/components/UI/MainButton.vue'
import Box from '@/components/UI/Box.vue'
import Draggable from 'vuedraggable'
import Checkbox from '@/components/UI/Checkbox.vue'
import FileUploader from '@/elements/FileUploader.vue'
import { useToastsStore } from '@/stores/toasts.store'
import { imageRetry } from '@/utils'
import { Sex } from '@/types'
import { cid, container } from 'inversify-props'
import { ICatalogService, IFileUploader } from '@/services/interfaces'
import { useRoute, useRouter } from 'vue-router'
import MainSelect from '@/components/UI/MainSelect.vue'
import { useLoaderStore } from '@/stores/loader.store'

const catalogServices = container.get<ICatalogService>(cid.CatalogService)
const fileUploaderService = container.get<IFileUploader>(cid.FileUploaderService)

type Photo = {
  img: string
  order: number
}

type FormType = {
  name: string
  description: string
  price: string
  discount: string
  sex: Sex
  publish: boolean
  photos: Array<Photo>
  photosData: Array<File>
  categoriesIds: Array<number>
  colorsIds: Array<number>
  percentage: string
}

export default defineComponent({
  name: 'CatalogItem',
  components: {
    FileUploader,
    Checkbox,
    Box,
    MainButton,
    MIcon,
    Page,
    TextField,
    Draggable,
    MainSelect
  },
  setup() {
    const colorsStore = useColorsStore()
    const categoriesStore = useCategoriesStore()
    const toastsStore = useToastsStore()
    const loaderStore = useLoaderStore()
    const route = useRoute()
    const router = useRouter()

    const drag = ref(false)
    const lastPhotoOrder = ref(0)

    const { loading } = storeToRefs(loaderStore)

    const viewName = computed(() => {
      return route.name
    })

    const isEdit = computed(() => {
      return viewName.value === 'EditCatalogItem'
    })

    const id = computed(() => {
      return isEdit.value ? +route.params.id : -1
    })

    const form = reactive<FormType>({
      name: '',
      description: '',
      price: '',
      discount: '0',
      sex: Sex.Unisex,
      publish: false,
      photos: [],
      photosData: [],
      categoriesIds: [],
      colorsIds: [],
      percentage: ''
    })

    const sexItems = [
      { title: 'Унисекс', value: Sex.Unisex },
      { title: 'Мужской', value: Sex.Male },
      { title: 'Женский', value: Sex.Female }
    ]

    const { sortedColors: colors } = storeToRefs(colorsStore)
    const { categories } = storeToRefs(categoriesStore)

    const photosList = computed(() => {
      return form.photos.map(p => {
        return p.img
      })
    })

    const cantCreate = computed(() => {
      return (
        !form.name ||
        !form.description ||
        !form.price ||
        !form.discount ||
        !form.photos.length ||
        !form.categoriesIds.length ||
        !form.colorsIds.length
      )
    })

    onMounted(async () => {
      try {
        if (viewName.value === 'EditCatalogItem') {
          const id = route.params.id as string
          await getCatalogItem(+id)
        }
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ Произошла ошибка при получении товара. Код: ${e.response.status}`
        })
      }
    })

    function selectCategory(id: number) {
      if (form.categoriesIds.includes(id)) {
        form.categoriesIds = form.categoriesIds.filter(x => x !== id)
      } else {
        form.categoriesIds.push(id)
      }
    }

    async function getCatalogItem(id: number) {
      const { data } = await catalogServices.getCatalogItem(id)
      form.name = data.name
      form.description = data.description
      form.price = data.price
      form.discount = data.discount.toString()
      form.sex = data.sex
      form.publish = data.isActive
      form.photos = data.photos.map((x, i) => {
        return {
          img: x,
          order: i
        }
      })
      form.categoriesIds = data.itemCategories.map(x => x.id)
      form.colorsIds = data.itemColors.map(x => x.id)
    }

    function selectColor(id: number) {
      if (form.colorsIds.includes(id)) {
        form.colorsIds = form.colorsIds.filter(x => x !== id)
      } else {
        form.colorsIds.push(id)
      }
    }

    function deletePhoto(order: number) {
      form.photos = form.photos.filter(x => x.order !== order)
    }

    async function catalogItemAction() {
      try {
        const data = {
          name: form.name,
          description: form.description,
          price: form.price,
          sex: form.sex,
          discount: +form.discount,
          photos: photosList.value,
          itemCategoriesIds: form.categoriesIds,
          itemColorsIds: form.colorsIds,
          metadata: {},
          isActive: form.publish
        }
        isEdit.value
          ? await catalogServices.editCatalogItem(id.value, data)
          : await catalogServices.createCatalogItem(data)
        toastsStore.$show(isEdit.value
          ? '✨ Товар успешно отредактирован!'
          : '✨ Новый товар успешно создан!')
        await router.push({ name: 'CatalogList' })
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ Произошла ошибка при создании товара. Код: ${e.response.status}`
        })
      }
    }

    function waitAndReload(e: Event) {
      imageRetry(e)
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

    async function uploadPhotos() {
      if (form.photosData.length > 0) {
        const { data } = await fileUploaderService.upload(form.photosData, uploaderErrors, getPercentage)
        if (data.length > 0) {
          data.forEach(p => {
            form.photos.push({
              img: `https://cdn.4be.site/${p}`,
              order: lastPhotoOrder.value++
            })
          })
        }
        form.photosData = []
        form.percentage = ''
      }
    }

    return {
      form,
      drag,
      colors,
      categories,
      deletePhoto,
      selectColor,
      selectCategory,
      catalogItemAction,
      cantCreate,
      waitAndReload,
      uploadPhotos,
      isEdit,
      sexItems,
      loading
    }
  }
})
</script>

<style lang="scss" scoped>
.content {
  padding: 0 18px 18px 18px;
  .main-data-block {
    max-width: 498px;
  }
  .block {
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: 0;
    }
    .field {
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .block-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
    }
  }
}
.item-photos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-auto-rows: 1fr;
  grid-gap: 15px;
  .uploader {
    aspect-ratio: 1;
  }
  .item-photo-wrap {
    aspect-ratio: 1;
    border: 1px solid $cs-border;
    border-radius: 3px;
    overflow: hidden;
    position: relative;
    .delete-photo {
      position: absolute;
      top: 5px;
      right: 5px;
      background-color: rgba(0, 0, 0, .5);
      border: none;
      border-radius: 2px;
      color: $cs-white;
      display: flex;
      opacity: 0;
    }
    &:hover {
      .delete-photo {
        opacity: 1;
      }
    }
    .item-photo {
      height: 100%;
      width: 100%;
    }
  }
}
.add-photo-button {
  aspect-ratio: 1;
  height: 100%;
  width: 100%;
  user-select: none;
  background-color: $cs-primary-light;
  border: 2px dashed $cs-primary;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  &:focus {
    outline: none;
    border-style: solid;
  }
  .add-photo-icon {
    margin-bottom: 2px;
    color: $cs-primary;
  }
  .add-photo-text {
    font-size: 14px;
    font-weight: 600;
    color: $cs-primary;
  }
}
.category-photo {
  display: flex;
  margin-top: 10px;
  border: 1px solid $cs-border;
  max-width: 280px;
}
.publish-catalog-item {
  display: flex;
  align-items: center;
  .add-catalog-item {
    margin-right: 20px;
  }
}
</style>

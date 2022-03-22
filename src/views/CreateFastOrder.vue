<template>
  <div class="fast-order">
    <div class="fast-order-content">
      <div class="order-blocks">
        <page title="Данные о доставке" style="margin-bottom: 30px;">
          <div class="content">
            <text-field class="field" id="country" v-model:text="address.country" label="Страна" :disabled="loading" />
            <text-field class="field" id="city" v-model:text="address.city" label="Город" :disabled="loading" />
            <text-field class="field" id="address1" v-model:text="address.address1" label="Адрес 1" :disabled="loading" />
            <text-field class="field" id="address2" v-model:text="address.address2" label="Адрес 2" :disabled="loading" />
            <text-field class="field" id="phone" v-model:text="phone" label="Номер телефона" :disabled="loading" />
            <text-field class="field" id="zip" v-model:text="address.zip" type="number" label="Индекс" :disabled="loading" />
          </div>
        </page>
        <page
          v-for="(product, index) in items"
          :key="index"
          :title="`Товар №${index + 1}`"
          :style="{ marginBottom: index + 1 === items.length ? '0' : '30px' }"
        >
          <template #header>
            <main-button v-if="index + 1 === items.length" @click="addProduct" :disabled="loading">
              Добавить еще товар
            </main-button>
            <main-button v-if="items.length > 1" color="danger" @click="removeItem(index)" style="margin-left: 10px;" :disabled="loading">
              Убрать
            </main-button>
            <div class="fake" style="height: 40px;"></div>
          </template>
          <div class="content">
            <div class="block">
              <text-field class="field" id="item-name" v-model:text="product.catalogItem.name" label="Название" :disabled="loading" />
              <text-field class="field" id="description" v-model:text="product.catalogItem.description" label="Описание" :disabled="loading" />
              <text-field class="field" id="description" type="number" v-model:text="product.catalogItem.price" label="Цена, ₽" :disabled="loading" />
              <text-field class="field" id="amount" type="number" v-model:text.number="product.amount" label="Количество, шт." :disabled="loading" />
              <main-select class="field" id="payment" v-model="product.catalogItem.sex" :items="sexItems" label="Пол" :disabled="loading" />
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
                v-model="product.photosList"
                v-bind="{ animation: 200 }"
                @start="drag = true"
                @end="drag = false"
                item-key="order"
              >
                <template #item="{ element }">
                  <li class="item-photo-wrap" v-if="element.img !== 'button'">
                    <button class="delete-photo">
                      <m-icon icon="close" font-size="18px" />
                    </button>
                    <img class="item-photo" alt="photo" :src="element.img" @error="imageRetry">
                  </li>
                </template>
                <template #footer>
                  <file-uploader
                    v-model:files="product.photosData"
                    text="Добавить"
                    class="uploader"
                    multiple
                    key="uploader"
                    @upload="uploadPhotos($event, index)"
                    show-button-percentage
                    :percentage="percentage"
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
                  :class="{ active: product.catalogItem.itemColors.includes(color.id) }"
                  @click="selectColor(index, color.id)"
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
                  :class="{ active: product.catalogItem.itemCategories.includes(category.id) }"
                  @click="selectCategory(index, category.id)"
                  :disabled="loading"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>
            <div class="block">
              <h4 class="block-title">Размер</h4>
              <div class="properties">
                <button
                  class="property"
                  v-for="size in sizes"
                  :key="size.id"
                  :class="{ active: product.sizeId === size.id }"
                  @click="items[index].sizeId = size.id"
                  :disabled="loading"
                >
                  {{ size.sizeName }}
                </button>
              </div>
            </div>
          </div>
        </page>
      </div>
      <div class="create-block-wrap">
        <box class="delivery-block" padding="20px">
          <div class="title-wrap">
            <div class="title">
              <m-icon icon="paid" class="icon" outlined />
              <h4 class="title-text">Доставка</h4>
            </div>
            <icon-button icon="sync" @click="checkDeliveryPrice" :disabled="loading || !(isAddressValid && shipmentProvider)" />
          </div>
          <main-select class="field" v-model="shipmentProvider" :items="shipmentsListForSelect" id="shipment" label="Служба доставки" />
          <div class="variants" v-show="shipmentVariants.length">
            <Radio v-for="(variant, i) in shipmentVariants" :key="i" v-model="selectedShipmentVariant" :value="variant.deliveryType">
              {{ getShipmentVariant(variant.deliveryType) }} - <b>{{ variant.price }}₽</b>
            </Radio>
            <Radio v-model="selectedShipmentVariant" value="custom">Задать вручную</Radio>
          </div>
          <div class="custom-form" v-show="selectedShipmentVariant === 'custom'">
            <main-select class="field" v-model="selectedDeliveryMethod" :items="deliveryMethodsList" id="delivery-method" label="Способ доставки" />
            <text-field class="field" v-model:text="shipmentPrice" type="number" label="Стоимость доставки, ₽" />
          </div>
        </box>
        <box class="create-block" padding="20px">
          <div class="title-wrap">
            <div class="title">
              <m-icon icon="local_mall" class="icon" outlined />
              <h4 class="title-text">Создание заказа</h4>
            </div>
          </div>
          <span class="total">
            Стоимость:
            <b> {{ total }}₽</b>
          </span>
          <span class="total">
            Доставка:
            <b> {{ shipmentPrice || '0' }}₽</b>
          </span>
          <hr>
          <span class="total">
            Итого:
            <b> {{ +total + +(shipmentPrice || 0) }}₽</b>
          </span>
        </box>
        <main-button
          :disabled="!canSubmit || loading"
          block
          size="xl"
          rounded="2"
          fill
          @click="createManualOrder"
        >
          Создать заказ
        </main-button>
      </div>
    </div>
  </div>
  <modal
    @close="closeTokenModal"
    width="340px"
    title="Ссылка на заказ"
    :show="orderTokenModal"
  >
    <text-field :text="`https://fast.severside.store/#/${orderToken}`" ref="token" id="message" readonly />
    <main-button block style="margin-top: 10px;" @click="copyTrackLink">
      Скопировать и закрыть
    </main-button>
  </modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, Ref, ref, watch } from 'vue'
import Page from '@/elements/Page.vue'
import TextField from '@/components/UI/TextField.vue'
import MainButton from '@/components/UI/MainButton.vue'
import {
  CreateFastOrderData,
  DeliveryMethod,
  DeliveryType,
  FastOrderItemAttributes,
  PaymentMethod,
  Sex,
  ShipmentVariant,
} from '@/types'
import Box from '@/components/UI/Box.vue'
import MIcon from '@/components/UI/MIcon.vue'
import Draggable from 'vuedraggable'
import FileUploader from '@/elements/FileUploader.vue'
import { getShipmentProvider, getShipmentVariant, imageRetry, usePhone } from '@/utils'
import { useColorsStore } from '@/stores/colors.store'
import { useSizesStore } from '@/stores/sizes.store'
import { useCategoriesStore } from '@/stores/categories.store'
import { storeToRefs } from 'pinia'
import Modal from '@/components/UI/Modal.vue'
import { useLoaderStore } from '@/stores/loader.store'
import { useToastsStore } from '@/stores/toasts.store'
import { cid, container } from 'inversify-props'
import { IFileUploader, IOrdersService, IShipmentService } from '@/services/interfaces'
import MainSelect from '@/components/UI/MainSelect.vue'
import { useShipmentsStore } from '@/stores/shipments.store'
import Radio from '@/components/UI/Radio.vue'
import IconButton from '@/components/UI/IconButton.vue'

const orderService = container.get<IOrdersService>(cid.OrdersService)
const shipmentService = container.get<IShipmentService>(cid.ShipmentService)
const fileUploaderService = container.get<IFileUploader>(cid.FileUploaderService)

export default defineComponent({
  name: 'CreateFastOrder',
  components: {
    IconButton,
    Modal,
    Page,
    TextField,
    MainButton,
    Box,
    MIcon,
    FileUploader,
    Draggable,
    MainSelect,
    Radio
  },
  setup() {
    const sizesStore = useSizesStore()
    const colorsStore = useColorsStore()
    const categoriesStore = useCategoriesStore()
    const loaderStore = useLoaderStore()
    const toastsStore = useToastsStore()
    const shipmentStore = useShipmentsStore()

    const token = ref<Ref | null>(null)

    const drag = ref(false)
    const lastPhotoOrder = ref(0)
    const orderTokenModal = ref(false)
    const orderToken = ref('')
    const percentage = ref('')

    const { shipmentsList } = storeToRefs(shipmentStore)
    const { sortedColors: colors } = storeToRefs(colorsStore)
    const { categories } = storeToRefs(categoriesStore)
    const { sortedSizes: sizes } = storeToRefs(sizesStore)
    const { loading } = storeToRefs(loaderStore)

    const shipmentVariants = ref<ShipmentVariant[]>([])
    const shipmentPrice = ref('')
    const shipmentProvider = ref('')
    const selectedShipmentVariant = ref<DeliveryType | 'custom'>('custom')

    const selectedDeliveryMethod = ref<DeliveryType>(DeliveryType.PickPoint)
    const deliveryMethodsList: { title: string, value: DeliveryType }[] = [
      {
        title: 'Постамат',
        value: DeliveryType.Office
      },
      {
        title: 'Пункт выдачи',
        value: DeliveryType.PickPoint
      },
      {
        title: 'Курьер',
        value: DeliveryType.Courier
      }
    ]

    const sexItems = [
      { title: 'Унисекс', value: Sex.Unisex },
      { title: 'Мужской', value: Sex.Male },
      { title: 'Женский', value: Sex.Female }
    ]

    watch(selectedShipmentVariant, v => {
      if (v !== 'custom') {
        selectedDeliveryMethod.value = v
        const variant = shipmentVariants.value.find(x => x.deliveryType === v)
        if (variant) shipmentPrice.value = String(variant.price)
      }
    })

    const shipmentsListForSelect = computed(() => {
      const list = shipmentsList.value.map(x => {
        return {
          title: getShipmentProvider(x),
          value: x
        }
      })
      return [{ title: 'Выберите службу', value: '', disabled: true }, ...list]
    })

    const { phone, isPhoneValid } = usePhone('')
    const address = reactive({
      country: 'Россия',
      city: '',
      address1: '',
      address2: '',
      phone,
      email: '',
      zip: '',
    })

    const items = reactive<FastOrderItemAttributes[]>([
      {
        amount: 1,
        sizeId: 0,
        photosData: [],
        photosList: [],
        catalogItem: {
          name: '',
          description: '',
          price: '0',
          discount: 0,
          photos: [],
          itemCategories: [],
          itemColors: [],
          metadata: {},
          sex: Sex.Unisex
        }
      }
    ])

    const total = computed(() => {
      return items.reduce((acc, v) => {
        return acc + (+v.catalogItem.price * +v.amount)
      }, 0)
    })

    const canSubmit = computed(() => {
      return isAddressValid.value
        && !!isOrderValid.value
        && !!shipmentPrice.value
        && !shipmentPrice.value.includes('e')
        && !!shipmentProvider.value
        && !!selectedDeliveryMethod.value
    })

    const isAddressValid = computed(() => {
      return !!address.country
        && !!address.city
        && !!address.address1
        && isPhoneValid.value
        && (address.zip.length === 0 || address.zip.length === 6)
        && !address.zip.includes('e')
    })

    const addressText = computed(() => {
      return `${address.country}, ${address.city}, ${address.address1}${address.address2 ? `, ${address.address2}` : ''}`
    })

    const isOrderValid = ref(false)
    watch(
      () => items,
      (v) => {
        const validItems = v.map(item => {
          return !!item.sizeId
            && !!item.amount
            && !!item.catalogItem.name.trim()
            && !!item.catalogItem.price.trim()
            && !item.catalogItem.price.includes('e')
            && !!item.catalogItem.sex
            && !!item.photosList.length
            && !!item.catalogItem.itemCategories.length
            && !!item.catalogItem.itemColors.length
        })
        isOrderValid.value = validItems.every(x => x)
      },
      { deep: true }
    )

    function selectColor(index: number, id: number) {
      if (items[index].catalogItem.itemColors.includes(id)) {
        items[index].catalogItem.itemColors = items[index].catalogItem.itemColors.filter(x => x !== id)
      } else {
        items[index].catalogItem.itemColors.push(id)
      }
    }

    function selectCategory(index: number, id: number) {
      if (items[index].catalogItem.itemCategories.includes(id)) {
        items[index].catalogItem.itemCategories = items[index].catalogItem.itemCategories.filter(x => x !== id)
      } else {
        items[index].catalogItem.itemCategories.push(id)
      }
    }

    function openTokenModal(token: string) {
      orderToken.value = token
      orderTokenModal.value = true
    }

    function closeTokenModal() {
      orderTokenModal.value = false
      orderToken.value = ''
    }

    function addProduct() {
      items.push({
        amount: 1,
        sizeId: 0,
        photosData: [],
        photosList: [],
        catalogItem: {
          name: '',
          description: '',
          price: '0',
          discount: 0,
          photos: [],
          itemCategories: [],
          itemColors: [],
          metadata: {},
          sex: Sex.Unisex
        }
      })
    }

    function removeItem(index: number) {
      items.splice(index, 1)
    }

    function getPercentage(e: ProgressEvent): void {
      percentage.value = `${(e.loaded / e.total * 100).toFixed(0)}%`
    }

    function uploaderErrors(index: number) {
      toastsStore.$show({
        type: 'danger',
        text: `⛔ Ошибка при загрузке файла: ${index + 1}`
      })
    }

    async function uploadPhotos(list: Array<File>, index: number) {
      if (list.length > 0) {
        const { data } = await fileUploaderService.upload(list, uploaderErrors, getPercentage)
        if (data.length > 0) {
          data.forEach(p => {
            items[index].photosList.push({
              img: `https://cdn.4be.site/${p}`,
              order: lastPhotoOrder.value++
            })
          })
        }
        items[index].photosData = []
        percentage.value = ''
      }
    }

    async function createManualOrder() {
      try {
        const orderData: CreateFastOrderData = {
          address: { ...address },
          paymentMethod: PaymentMethod.YooMoney,
          deliveryMethod: DeliveryMethod.RussianPost,
          items: items.map(x => {
            return {
              amount: x.amount,
              sizeId: x.sizeId,
              catalogItem: {
                ...x.catalogItem,
                photos: x.photosList.map(i => i.img)
              }
            }
          })
        }
        const { data: order } = await orderService.createManualOrder(orderData)
        await addDelivery(order.id)
        const { data } = await orderService.getFastCode(order.id)
        openTokenModal(data)
        toastsStore.$show('✨ Заказ успешно создан!')
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ Произошла ошибка при создании заказа. Код: ${e.response.status}`
        })
      }
    }

    async function addDelivery(id: number) {
      if (shipmentPrice.value) {
        await orderService.addDelivery(id, {
          deliveryMethod: selectedDeliveryMethod.value,
          deliveryProvider: shipmentProvider.value,
          price: shipmentPrice.value || '0'
        })
      }
    }

    async function checkDeliveryPrice() {
      try {
        const { data } = await shipmentService.estimateShipping({
          address: addressText.value,
          shipmentProvider: shipmentProvider.value
        })
        shipmentVariants.value = data
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ Произошла ошибка при оценивании стоимости доставки. Код: ${e.response.status}`
        })
      }
    }

    function selectShipmentPrice(price: string) {
      shipmentPrice.value = price
    }

    function copyTrackLink() {
      closeTokenModal()
      const input = token.value.$el.querySelector('input')
      input.select()
      document.execCommand('copy')
    }

    return {
      token,
      isOrderValid,
      phone,
      total,
      orderTokenModal,
      orderToken,
      canSubmit,
      drag,
      address,
      items,
      percentage,
      sizes,
      colors,
      categories,
      loading,
      copyTrackLink,
      closeTokenModal,
      selectColor,
      selectCategory,
      addProduct,
      removeItem,
      uploadPhotos,
      imageRetry,
      createManualOrder,
      checkDeliveryPrice,
      shipmentVariants,
      shipmentPrice,
      shipmentProvider,
      shipmentsListForSelect,
      selectedShipmentVariant,
      getShipmentVariant,
      selectShipmentPrice,
      isAddressValid,
      selectedDeliveryMethod,
      deliveryMethodsList,
      sexItems
    }
  }
})
</script>

<style lang="scss" scoped>
.fast-order {
  width: 100%;
  display: flex;
  align-items: flex-start;
  .fast-order-content {
    width: 100%;
    display: flex;
    align-items: flex-start;
  }
}
.order-blocks {
  width: 100%;
  margin-right: 30px;
}
.create-block-wrap {
  display: flex;
  flex-direction: column;
  max-width: 320px;
  width: 100%;
  position: sticky;
  top: 120px;
}

.create-block,
.delivery-block {
  width: 100%;
  margin-bottom: 15px;
  .title-wrap {
    border-bottom: 1px solid $cs-border;
    padding-bottom: 15px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 46px;
  }
  hr {
    border: none;
    border-bottom: 1px solid $cs-border;
    margin-bottom: 10px;
  }
  .title {
    display: flex;
    align-items: center;
    .icon {
      color: $cs-primary;
      padding-right: 7px;
    }
    .title-text {
      font-size: 16px;
    }
  }
  .custom-form {
    margin-top: 15px;
  }
  .total {
    font-size: 14px;
    font-weight: 500;
    display: block;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .variants {
    .variant {
      display: flex;
      align-items: center;
      margin-bottom: 7px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.field {
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
}
.content {
  padding: 0 18px 18px 18px;
  .block {
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: 0;
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
</style>

<template>
  <div class="main-layout">
    <main-header @logout="logout" />
    <main class="main-content container" :style="{ maxWidth: `${containerWidth}px` }">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount } from 'vue'
import Header from '@/elements/Header.vue'
import { useColorsStore } from '@/stores/colors.store'
import { useSizesStore } from '@/stores/sizes.store'
import { useCategoriesStore } from '@/stores/categories.store'
import { useToastsStore } from '@/stores/toasts.store'
import { useUserStore } from '@/stores/user.store'
import { useShipmentsStore } from '@/stores/shipments.store'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'Main',
  components: { MainHeader: Header },
  setup() {
    const colorsStore = useColorsStore()
    const sizesStore = useSizesStore()
    const categoriesStore = useCategoriesStore()
    const toastsStore = useToastsStore()
    const userStore = useUserStore()
    const shipmentStore = useShipmentsStore()
    const router = useRouter()
    const route = useRoute()

    const logout = () => {
      userStore.logout()
      router.push({ name: 'Auth' })
    }

    onBeforeMount(() => {
      try {
        colorsStore.getColors()
        sizesStore.getSizes()
        categoriesStore.getCategories()
        shipmentStore.getShipmentsList()
      } catch (e) {
        toastsStore.$show({
          type: 'danger',
          text: `⛔ ${e.message}`
        })
      }
    })

    const containerWidth = computed(() => route.meta?.container || 1140)

    return { logout, containerWidth }
  }
})
</script>

<style lang="scss" scoped>
.main-content {
  padding-top: 120px;
  padding-bottom: 60px;
}
.container {
  margin: 0 auto;
  width: 100%;
}
</style>

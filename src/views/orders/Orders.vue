<template>
  <div class="orders">
    <aside class="navigation-side">
      <navigation-block style="margin-bottom: 30px;" icon="shopping_cart" outlined title="Просмотр" :items="views" />
    </aside>
    <div class="orders-content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavigationBlock from '@/components/NavigationBlock/NavigationBlock.vue'

export default defineComponent({
  name: 'Orders',
  components: { NavigationBlock },
  setup() {
    const views = [
      { route: 'OrdersList', name: 'Список заказов' },
      { route: 'OrdersByPhone', name: 'Поиск заказов по номеру' },
      { route: 'OrderByCode', name: 'Поиск по коду' },
    ]

    return { views }
  }
})
</script>

<style lang="scss" scoped>
.orders {
  width: 100%;
  display: flex;
  align-items: flex-start;
  .navigation-side {
    max-width: 320px;
    width: 100%;
    margin-right: 30px;
  }
  .orders-content {
    width: 100%;
  }
}
</style>

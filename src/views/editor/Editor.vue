<template>
  <div class="editor">
    <aside class="navigation-side">
      <navigation-block style="margin-bottom: 30px;" icon="list_alt" title="Свойства" :items="internals" />
      <navigation-block icon="grid_view" title="Каталог" :items="catalog" />
    </aside>
    <div class="editor-content">
      <router-view :key="$route.name" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavigationBlock from '@/components/NavigationBlock/NavigationBlock.vue'

export default defineComponent({
  name: 'Editor',
  components: { NavigationBlock },
  setup() {
    const internals = [
      { route: 'Categories', name: 'Категории' },
      { route: 'Colors', name: 'Цвета' },
      { route: 'Sizes', name: 'Размеры' }
    ]
    const catalog = [
      { route: 'CreateCatalogItem', name: 'Добавить новый товар' },
      { route: 'CatalogList', name: 'Список товаров' }
    ]
    return { internals, catalog }
  }
})
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  display: flex;
  align-items: flex-start;
  .navigation-side {
    max-width: 320px;
    width: 100%;
    margin-right: 30px;
  }
  .editor-content {
    width: 100%;
  }
}
</style>

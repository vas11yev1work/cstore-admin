<template>
  <div class="pagination">
    <icon-button
      icon="keyboard_double_arrow_left"
      style="margin-right: 3px;"
      @click="updatePage(1)"
    />
    <icon-button
      icon="keyboard_arrow_left"
      style="margin: 0 3px;"
      @click="updatePage(page - 1)"
    />
    <button
      v-for="p in viewedPages"
      class="page-button"
      :class="{ current: p === page}"
      :key="p"
      @click="updatePage(p)"
    >
      {{ p }}
    </button>
    <icon-button
      icon="keyboard_arrow_right"
      style="margin: 0 3px;"
      @click="updatePage(page + 1)"
    />
    <icon-button
      icon="keyboard_double_arrow_right"
      style="margin-left: 3px;"
      @click="updatePage(pagesCount)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import IconButton from '@/components/UI/IconButton.vue'

export default defineComponent({
  name: 'Pagination',
  components: { IconButton },
  props: {
    page: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    take: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }) {
    const pagesCount = computed(() => {
      return Math.ceil(props.count / props.take)
    })

    const viewedPages = computed(() => {
      if (pagesCount.value > 5) {
        if (props.page < 4) {
          return [1, 2, 3, 4, 5]
        }
        if (props.page > pagesCount.value - 3) {
          return [pagesCount.value - 4, pagesCount.value - 3, pagesCount.value - 2, pagesCount.value - 1, pagesCount.value]
        }
        return [props.page - 2, props.page - 1, props.page, props.page + 1, props.page + 2]
      }
      return new Array(pagesCount.value).fill(0).map((x, i) => i + 1)
    })

    function updatePage(page: number) {
      if (page < 1 || page > pagesCount.value) return
      emit('update:page', page)
    }

    return {
      pagesCount,
      viewedPages,
      updatePage
    }
  }
})
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  .page-button {
    height: 30px;
    width: 30px;
    margin: 0 3px;
    border: 1px solid $cs-border;
    background-color: $cs-white;
    color: $cs-black;
    border-radius: 3px;
    &.current {
      background-color: $cs-primary-light;
      color: $cs-primary;
      border-color: transparentize($cs-primary, 0.7);
    }
  }
}
</style>

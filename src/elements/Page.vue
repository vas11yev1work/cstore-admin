<template>
  <box class="page" padding="0 0">
    <div class="page-header" :class="{ 'with-header': withHeader }">
      <h1 class="page-title">{{ title }}</h1>
      <div class="page-header-content">
        <slot name="header" />
      </div>
    </div>
    <div class="page-content">
      <slot />
    </div>
  </box>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Box from '@/components/UI/Box.vue'

export default defineComponent({
  name: 'Page',
  components: { Box },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup(_, { slots }) {
    const withHeader = !!slots?.header

    return { withHeader }
  }
})
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 18px;
    &.with-header {
      padding: 16px 18px;
    }
    .page-title {
      font-size: 20px;
      font-weight: 600;
    }
    .page-header-content {
      display: flex;
    }
  }
}
</style>

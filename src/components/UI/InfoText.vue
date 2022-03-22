<template>
  <p class="info-text" :class="{ padding }">
    <slot>Text</slot>
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InfoText',
  props: {
    padding: {
      type: Boolean,
      default: true
    }
  }
})
</script>

<style lang="scss" scoped>
.info-text {
  line-height: 1.5;
  font-size: 14px;
  font-weight: 500;
  &.padding {
    padding-bottom: 7px;
  }
}
</style>

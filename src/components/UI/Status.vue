<template>
  <span :class="['status', color]">
    <slot>Done</slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Status',
  props: {
    color: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.status {
  padding: 3px 5px;
  color: $cs-white;
  border-radius: 3px;
  &.green {
    background-color: $cs-green;
  }
  &.red {
    background-color: $cs-red;
  }
  &.blue {
    background-color: $cs-primary;
  }
  &.yellow {
    background-color: $cs-yellow;
  }
}
</style>

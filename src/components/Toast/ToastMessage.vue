<template>
  <li class="toast" :class="{ [`toast-${type}`]: true }">
    <span class="toast-text">{{ text }}</span>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Toast',
  props: {
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.toast {
  padding: 10px 15px;
  border-radius: 5px;
  user-select: none;
  margin-bottom: 10px;
  color: $cs-white;

  &.toast-primary {
    background-color: $cs-primary;
  }
  &.toast-success {
    background-color: $cs-green;
  }
  &.toast-warning {
    background-color: $cs-yellow;
  }
  &.toast-danger {
    background-color: $cs-red;
  }
  &.toast-black {
    background-color: $cs-black;
  }

  .toast-text {
    font-size: 16px;
    line-height: 1.5;
  }
}
</style>

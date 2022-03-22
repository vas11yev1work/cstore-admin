<template>
  <div class="box" :style="{ padding, borderRadius }">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Box',
  props: {
    padding: {
      type: String,
      default: '15px 18px'
    },
    borderRadius: {
      type: String,
      default: '8px'
    }
  }
})
</script>

<style lang="scss" scoped>
.box {
  overflow: hidden;
  background-color: $cs-white;
  box-shadow: 5px 10px 50px rgba(0, 0, 0, 0.03);
}
</style>

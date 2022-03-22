<template>
  <span :class="[outlined ? 'material-icons-outlined' : 'material-icons']" class="micon" :style="{ fontSize }">
    {{ icon }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MIcon',
  props: {
    icon: {
      type: String,
      default: 'search'
    },
    fontSize: {
      type: String,
      default: '24px'
    },
    outlined: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped>
.micon {
  user-select: none;
}
</style>

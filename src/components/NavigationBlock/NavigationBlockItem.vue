<template>
  <li class="nav-item">
    <router-link class="item-link" :to="{ name: route }">
      <slot>Link</slot>
    </router-link>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavigationBlockItem',
  props: {
    route: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.nav-item {
  .item-link {
    display: flex;
    height: 40px;
    font-size: 14px;
    text-decoration: none;
    color: $cs-black;
    font-weight: 500;
    align-items: center;
    padding: 0 12px;
    border-radius: 3px;
    &:hover {
      background-color: $cs-background;
    }
    &.router-link-active {
      color: $cs-primary;
      background-color: $cs-background;
    }
  }
}
</style>

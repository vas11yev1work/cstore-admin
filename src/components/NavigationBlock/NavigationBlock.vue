<template>
  <box class="navigation-block">
    <div class="title">
      <m-icon :icon="icon" class="icon" :outlined="outlined" />
      <h4 class="title-text">{{ title }}</h4>
    </div>
    <ul class="nav-list">
      <navigation-block-item :route="item.route" v-for="(item, i) in items" :key="i">
        <slot :item="item">{{ item?.name }}</slot>
      </navigation-block-item>
    </ul>
  </box>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Box from '@/components/UI/Box.vue'
import NavigationBlockItem from './NavigationBlockItem.vue'
import MIcon from '@/components/UI/MIcon.vue'

export default defineComponent({
  name: 'NavigationBlock',
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    icon: {
      type: String,
      default: 'search'
    },
    items: {
      type: Array,
      required: true
    },
    outlined: {
      type: Boolean,
      default: false,
    }
  },
  components: { Box, NavigationBlockItem, MIcon }
})
</script>

<style lang="scss" scoped>
.navigation-block {
  .title {
    display: flex;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 1px solid $cs-border;
    margin-bottom: 10px;
    .icon {
      color: $cs-primary;
      padding-right: 7px;
    }
    .title-text {
      font-size: 16px;
    }
  }
}
</style>

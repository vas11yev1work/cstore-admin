<template>
  <button class="main-button" :class="classes" @click="$emit('click')" :disabled="disabled">
    <m-icon :icon="icon" v-if="icon" />
    <slot>Button</slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import MIcon from '@/components/UI/MIcon.vue'

type Size = 'sm' | 'md' | 'xl'
type Rounded = '0' | '1' | '2' | 'max'
type Color = 'primary' | 'success' | 'danger' | 'warning'

export default defineComponent({
  name: 'MainButton',
  emits: ['click'],
  components: { MIcon },
  props: {
    size: {
      type: String as PropType<Size>,
      default: 'md',
    },
    color: {
      type: String as PropType<Color>,
      default: 'primary'
    },
    rounded: {
      type: String as PropType<Rounded>,
      default: '1',
    },
    icon: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fill: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const classes = computed(() => {
      return {
        icon: !!props.icon,
        fill: props.fill,
        block: props.block,
        [props.size]: true,
        [`rounded-${props.rounded}`]: true,
        [props.color]: true
      }
    })

    return { classes }
  }
})
</script>

<style lang="scss" scoped>
@mixin button-color($c, $c-light) {
  background-color: $c-light;
  color: $c;
  &.fill {
    background-color: $c;
    color: $cs-white;
  }
}
.main-button {
  border: none;
  font-size: 14px;
  font-weight: 600;
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  &.sm {
    height: 32px;
    padding: 0 12px;
  }
  &.md {
    height: 40px;
    padding: 0 18px;
  }
  &.xl {
    height: 50px;
    padding: 0 22px;
  }
  &.rounded-0 {
    border-radius: 0;
  }
  &.rounded-1 {
    border-radius: 3px;
  }
  &.rounded-2 {
    border-radius: 8px;
  }
  &.rounded-max {
    border-radius: 25px;
  }
  &.block {
    width: 100%;
  }
  &.primary {
    @include button-color($cs-primary, $cs-primary-light);
  }
  &.danger {
    @include button-color($cs-red, $cs-red-light);
  }
  &.success {
    @include button-color($cs-green, $cs-green-light);
  }
  &.warning {
    @include button-color($cs-yellow, $cs-yellow-light);
  }
}
</style>

<template>
  <button class="icon-button" :class="classes" @click.stop="$emit('click')" :disabled="disabled">
    <m-icon :icon="icon" :font-size="size" :outlined="outlined" />
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import MIcon from '@/components/UI/MIcon.vue'

type Color = 'primary' | 'success' | 'danger' | 'warning'

export default defineComponent({
  name: 'IconButton',
  components: { MIcon },
  props: {
    icon: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '20px'
    },
    color: {
      type: String as PropType<Color>,
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    fill: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props) {
    const classes = computed(() => ({
      [props.color]: true,
      fill: props.fill
    }))

    return { classes }
  }
})
</script>

<style lang="scss" scoped>
@mixin button-color($c, $c-light) {
  background-color: $c-light;
  color: $c;
}
@mixin filled-button-color($c) {
  background-color: $c;
  color: $cs-white;
}

.icon-button {
  height: 30px;
  width: 30px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  user-select: none;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  &.primary {
    @include button-color($cs-primary, $cs-primary-light);
    &.fill {
      @include filled-button-color($cs-primary);
    }
  }
  &.danger {
    @include button-color($cs-red, $cs-red-light);
    &.fill {
      @include filled-button-color($cs-primary);
    }
  }
  &.success {
    @include button-color($cs-green, $cs-green-light);
    &.fill {
      @include filled-button-color($cs-primary);
    }
  }
  &.warning {
    @include button-color($cs-yellow, $cs-yellow-light);
    &.fill {
      @include filled-button-color($cs-primary);
    }
  }
}
</style>

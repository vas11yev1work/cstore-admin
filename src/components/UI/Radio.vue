<template>
  <label class="radio">
    <slot></slot>
    <input class="checkbox" type="radio" :checked="isChecked" :value="value" @change="$emit('update:modelValue', $event.target.value)" />
    <span class="checkmark"></span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Radio',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    isChecked() {
      return this.modelValue == this.value
    }
  }
})
</script>

<style lang="scss" scoped>
.radio {
  display: block;
  position: relative;
  padding-left: 24px;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  user-select: none;
  &:last-child {
    margin-bottom: 0;
  }
  input[type="radio"] {
    appearance: none;
    &:checked {
      ~ .checkmark {
        background-color: $cs-primary;
        border: none;
        &:after {
          display: block;
        }
      }
    }
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: $cs-light-grey;
    border: 1px solid $cs-border;
    border-radius: 50%;
    &::after {
      content: '';
      position: absolute;
      display: none;
      top: 5px;
      left: 5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $cs-white;
    }
  }
}
</style>

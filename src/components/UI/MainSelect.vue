<template>
  <div class="select">
    <label :for="id" v-if="label">{{ label }}</label>
    <select class="select-input" :class="{ small }" :disabled="disabled" :id="id" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="o in items" :key="o.value" :disabled="!!o.disabled" :value="o.value">
        {{ o.title }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

type ItemsType = {
  title: string
  value: string
  disabled?: boolean
}

export default defineComponent({
  name: 'Select',
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    items: {
      type: Array as PropType<ItemsType[]>,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="scss" scoped>
.select {
  width: 100%;
  .select-input {
    width: 100%;
    height: 40px;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid $cs-border;
    border-radius: 3px;
    appearance: none;
    padding: 0 16px;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    &:focus {
      border-color: lighten($cs-primary, 10%);
      box-shadow: 0 0 0 3px transparentize($cs-primary, 0.8);
    }
    &:disabled {
      background-color: $cs-background;
      color: $cs-secondary;
      cursor: not-allowed;
    }
    &.small {
      height: 30px;
      padding: 0 10px;
    }
  }
  label {
    font-weight: 600;
    font-size: 13px;
    color: $cs-secondary;
    display: block;
    margin-bottom: 2px;
  }
}
</style>

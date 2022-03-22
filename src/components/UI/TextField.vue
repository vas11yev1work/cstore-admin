<template>
  <div class="text-field">
    <label :for="id">{{ label }}</label>
    <input
      class="text-input"
      :id="id"
      :type="type"
      :value="text"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      @input="$emit('update:text', $event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TextField',
  props: {
    id: {
      type: String,
      default: ''
    },
    text: {
      type: [String, Number],
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:text'],
})
</script>

<style lang="scss" scoped>
.text-field {
  width: 100%;
  .text-input {
    width: 100%;
    height: 40px;
    font-size: 14px;
    font-weight: 500;
    padding: 0 16px;
    border: 1px solid $cs-border;
    border-radius: 3px;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    &::placeholder {
      color: $cs-secondary;
    }
    &:read-only {
      background-color: $cs-background;
    }
    &:disabled {
      background-color: $cs-background;
      color: $cs-secondary;
      cursor: not-allowed;
    }
    &:focus {
      border-color: lighten($cs-primary, 10%);
      box-shadow: 0 0 0 3px transparentize($cs-primary, 0.8);
    }
  }
  label {
    font-weight: 600;
    font-size: 13px;
    color: $cs-secondary;
    display: block;
    margin-bottom: 4px;
  }
}
</style>

<template>
  <label class="check" :for="id">
    <input
      @input="inputHandler($event.target.checked)"
      class="check-input"
      type="checkbox"
      :id="id"
      :checked="isChecked"
      :disabled="disabled"
    />
    <span class="checkbox"></span>
    <span class="text">
      <slot>Info</slot>
    </span>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Checkbox',
  emits: ['update:checked', 'update:list'],
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const isArray = ref(Array.isArray(props.list))

    const isChecked = computed(() => {
      if (isArray.value) {
        return props.list.includes(props.value)
      }
      return props.checked
    })

    const check = () => {
      let updatedList = [...props.list]
      if (isChecked.value) {
        updatedList.splice(updatedList.indexOf(props.value), 1)
      } else {
        updatedList.push(props.value)
      }
      emit('update:list', updatedList)
    }

    const inputHandler = (checked: boolean) => {
      if (isArray.value) {
        check()
      } else {
        emit('update:checked', checked)
      }
    }

    return { isChecked, inputHandler }
  }
})
</script>

<style lang="scss" scoped>
.check {
  padding-left: 27px;
  cursor: pointer;
  display: flex;
  align-items: center;
  .check-input {
    appearance: none;
  }
  .checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid $cs-primary;
    background-color: $cs-white;
    border-radius: 2px;
    margin-left: -27px;
  }
  .check-input:checked + .checkbox {
    background-image: url('../../assets/images/check.svg');
  }
  .check-input:focus + .checkbox {
    box-shadow: 0 0 0 2px transparentize($cs-primary, 0.6);
  }
  .text {
    font-size: 14px;
    font-weight: 600;
    user-select: none;
    color: $cs-secondary;
    position: absolute;
  }
}
</style>

<template>
  <teleport to="#modals">
    <transition name="fade">
      <div class="modal-wrap" v-show="show" @click="$emit('close')">
        <div class="wrapper" :style="{ maxWidth: width }" @click.stop>
          <div class="modal">
            <div class="header">
              <h2 class="modal-title">{{ title }}</h2>
              <button class="close" @click="$emit('close')">&times;</button>
            </div>
            <div class="content">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'

export default defineComponent({
  name: 'Modal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '320px'
    }
  },
  emits: ['close'],
  setup(props) {
    const changeOverflow = (v: boolean) => {
      if (v) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.removeAttribute('style')
      }
    }
    watch(() => props.show, v => {
      changeOverflow(v)
    })
  }
})
</script>

<style lang="scss" scoped>
.modal-wrap {
  background-color: rgba(0, 0, 0, .3);
  cursor: pointer;
  display: block;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 10;
  .wrapper {
    margin: 40px auto;
    display: flex;
    align-items: center;
    .modal {
      position: relative;
      background-color: $cs-white;
      border-radius: 10px;
      cursor: auto;
      width: 100%;
      .header {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        .modal-title {
          font-size: 18px;
          font-weight: 600;
        }
        .close {
          position: absolute;
          top: 6px;
          right: 6px;
          height: 36px;
          width: 36px;
          font-size: 24px;
          border: none;
          background-color: transparent;
          color: $cs-grey;
        }
      }
      .content {
        padding: 0 20px 16px 20px;
      }
    }
  }
}
</style>

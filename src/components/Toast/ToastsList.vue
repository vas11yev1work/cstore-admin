<template>
  <transition-group name="toast" tag="ul" class="toasts-list">
    <toast-message
      v-for="toast in toasts"
      :key="toast.id"
      :type="toast.type"
      :text="toast.text"
    />
  </transition-group>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ToastMessage from './ToastMessage.vue'
import { useToastsStore } from '@/stores/toasts.store'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'ToastsList',
  components: { ToastMessage },
  setup() {
    const toastsStore = useToastsStore()
    const { toasts } = storeToRefs(toastsStore)

    return { toasts }
  }
})
</script>

<style lang="scss" scoped>
.toasts-list {
  position: fixed;
  top: 0;
  right: 0;
  padding: 15px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 15;
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.toast-move {
  transition: transform 0.4s ease;
}
</style>

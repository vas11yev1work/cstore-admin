import { computed, ref, watch } from 'vue'

export function useValidator(v: string, regexp: RegExp) {
  const value = ref(v)
  const touch = ref(false)

  const isValid = computed(() => {
    return regexp.test(value.value)
  })

  const isTouched = computed(() => {
    return touch
  })

  watch(value, (v) => {
    if (v.trim()) {
      touch.value = true
    }
  })

  const clear = () => {
    value.value = ''
    touch.value = false
  }

  return { value, isValid, isTouched, clear }
}

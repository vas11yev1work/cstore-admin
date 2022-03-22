import { computed, ref, watch } from 'vue'

export function useMaxLength(v: string, l: number) {
  const value = ref(v)
  const touch = ref(false)

  const isValid = computed(() => {
    return value.value.length <= l
  })

  watch(value, () => {
    if (value.value.trim()) {
      touch.value = true
    }
  })

  const isTouched = computed(() => {
    return touch
  })

  const clear = () => {
    value.value = ''
    touch.value = false
  }

  return { value, isValid, isTouched, clear }
}

import { computed, ComputedRef, Ref } from 'vue'
import { parsePhoneNumber } from 'libphonenumber-js/mobile'
import { customRef } from 'vue'
import { AsYouType } from 'libphonenumber-js/mobile'

type UsePhoneType = {
  phone: Ref<string>
  isPhoneValid: ComputedRef<boolean>
  internationalFormat: ComputedRef<string>
}

function usePhoneNumber(value: string) {
  return customRef<string>((track, trigger) => {
    return {
      get() {
        track()
        return new AsYouType('RU').input(value)
      },
      set(newValue) {
        trigger()
        value = newValue
      }
    }
  })
}

export function usePhone(value: string): UsePhoneType {
  const phone = usePhoneNumber(value)

  const isPhoneValid = computed<boolean>(() => {
    if (phone.value.trim()) {
      try {
        return parsePhoneNumber(phone.value, 'RU').isValid()
      } catch (e) {
        return false
      }
    } else return false
  })

  const internationalFormat = computed(() => {
    if (isPhoneValid.value) {
      return parsePhoneNumber(phone.value, 'RU').formatInternational()
    } else return phone.value
  })

  return { phone, isPhoneValid, internationalFormat }
}

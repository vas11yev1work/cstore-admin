import { useValidator } from '@/validators'

export function useEmail(v: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const { value, isValid, isTouched, clear } = useValidator(v, re)

  return { value, isValid, isTouched, clear }
}

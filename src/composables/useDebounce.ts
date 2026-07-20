import { ref, watch } from 'vue'

export function useDebounce<T>(source: import('vue').Ref<T>, delay = 300) {
  const debouncedValue = ref(source.value) as import('vue').Ref<T>

  watch(source, () => {
    setTimeout(() => {
      debouncedValue.value = source.value
    }, delay)
  })

  return debouncedValue
}

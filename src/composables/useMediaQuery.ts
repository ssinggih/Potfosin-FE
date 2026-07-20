import { ref, onMounted, onUnmounted } from 'vue'

export function useMediaQuery(query: string) {
  const matches = ref(false)

  function onChange(event: MediaQueryListEvent) {
    matches.value = event.matches
  }

  onMounted(() => {
    const mql = window.matchMedia(query)
    matches.value = mql.matches
    mql.addEventListener('change', onChange)
  })

  onUnmounted(() => {
    const mql = window.matchMedia(query)
    mql.removeEventListener('change', onChange)
  })

  return matches
}

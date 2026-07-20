import { ref, computed } from 'vue'

export function usePagination(totalItems: number, perPage = 10) {
  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(totalItems / perPage))
  const hasNext = computed(() => currentPage.value < totalPages.value)
  const hasPrev = computed(() => currentPage.value > 1)

  function goTo(page: number) {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  }

  function next() {
    if (hasNext.value) currentPage.value++
  }

  function prev() {
    if (hasPrev.value) currentPage.value--
  }

  return { currentPage, totalPages, hasNext, hasPrev, goTo, next, prev }
}

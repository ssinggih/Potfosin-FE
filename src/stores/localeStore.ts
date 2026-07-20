import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORAGE_KEYS } from '@/constants'

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<string>(localStorage.getItem(STORAGE_KEYS.LOCALE) || 'id')

  function setLocale(l: string) {
    locale.value = l
    localStorage.setItem(STORAGE_KEYS.LOCALE, l)
    document.documentElement.lang = l
  }

  function toggleLocale() {
    setLocale(locale.value === 'id' ? 'en' : 'id')
  }

  return { locale, setLocale, toggleLocale }
})

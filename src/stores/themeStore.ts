import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STORAGE_KEYS } from '@/constants'

type Theme = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  const saved = (
    typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.THEME) : null
  ) as Theme | null
  const prefersDark =
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  const initial: Theme = saved || (prefersDark ? 'dark' : 'light')

  const theme = ref<Theme>(initial)

  function applyTheme(t: Theme) {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(t)
    localStorage.setItem(STORAGE_KEYS.THEME, t)
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    applyTheme(newTheme)
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  function initTheme() {
    applyTheme(theme.value)
  }

  return { theme, setTheme, toggleTheme, initTheme }
})

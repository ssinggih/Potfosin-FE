<template>
  <div class="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
    <button
      class="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-lg transition-all hover:scale-110 dark:border-gray-700 dark:bg-gray-800"
      :title="theme === 'dark' ? 'Light mode' : 'Dark mode'"
      @click="themeStore.toggleTheme()"
    >
      <Sun v-if="theme === 'dark'" key="sun" class="h-5 w-5 text-yellow-400" />
      <Moon v-else key="moon" class="h-5 w-5 text-gray-600" />
    </button>

    <button
      class="flex h-12 w-12 items-center justify-center rounded-full border bg-white text-sm font-semibold shadow-lg transition-all hover:scale-110 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      :title="locale === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'"
      @click="localeStore.toggleLocale()"
    >
      {{ locale === 'id' ? 'EN' : 'ID' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/themeStore'
import { useLocaleStore } from '@/stores/localeStore'
import { Sun, Moon } from 'lucide-vue-next'

const themeStore = useThemeStore()
const localeStore = useLocaleStore()

const { theme } = storeToRefs(themeStore)
const { locale } = storeToRefs(localeStore)
</script>

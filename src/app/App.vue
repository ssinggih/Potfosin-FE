<template>
  <VueQueryDevtools v-if="!isProduction" />
  <div class="relative">
    <RouterView />
    <FloatingActions />
  </div>
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@features/auth'
import { STORAGE_KEYS } from '@/constants'
import FloatingActions from '@components/layout/FloatingActions.vue'

const isProduction = import.meta.env.PROD
const { initTheme } = useThemeStore()
const authStore = useAuthStore()

initTheme()

if (localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)) {
  authStore.fetchProfile()
}
</script>

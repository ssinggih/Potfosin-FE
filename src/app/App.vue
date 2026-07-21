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
import FloatingActions from '@components/layout/FloatingActions.vue'

const isProduction = import.meta.env.PROD
const { initTheme } = useThemeStore()

initTheme()
</script>

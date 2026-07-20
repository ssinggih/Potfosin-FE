<template>
  <header
    class="flex h-16 items-center justify-between border-b bg-white px-6 dark:border-gray-800 dark:bg-gray-900"
  >
    <router-link
      to="/"
      class="text-sm font-bold text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
    >
      ← Portfosin
    </router-link>
    <div class="flex items-center gap-3">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ authStore.user?.name }}
      </span>
      <div
        class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      >
        {{ authStore.user?.name?.charAt(0)?.toUpperCase() }}
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@features/auth'

const authStore = useAuthStore()
</script>

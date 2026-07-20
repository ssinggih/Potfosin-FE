<template>
  <input
    :class="
      cn(
        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500',
        error && 'border-red-500 focus:ring-red-500',
      )
    "
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { cn } from '@utils/cn'

interface Props {
  error?: string
}

defineProps<Props>()
</script>

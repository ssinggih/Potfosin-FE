<template>
  <div
    :class="
      cn(
        'rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900',
        hoverable && 'transition-shadow hover:shadow-md',
      )
    "
  >
    <div v-if="$slots.header" class="mb-4">
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" class="mt-4 border-t pt-4 dark:border-gray-800">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@utils/cn'

interface Props {
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  hoverable: false,
})
</script>

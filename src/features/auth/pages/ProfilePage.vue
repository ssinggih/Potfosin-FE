<template>
  <div class="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
    <h1 class="mb-8 text-2xl font-bold">Profile</h1>

    <Card>
      <div class="flex items-center gap-4">
        <div
          class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        >
          {{ user?.name?.charAt(0)?.toUpperCase() }}
        </div>
        <div>
          <h2 class="text-lg font-semibold">
            {{ user?.name }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ user?.email }}
          </p>
          <span
            class="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium dark:bg-gray-800"
          >
            {{ user?.role }}
          </span>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { Card } from '@components/cards'

const { user } = useAuth()
</script>

<template>
  <div class="animate-pulse space-y-8">
    <div class="space-y-4">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="space-y-3">
          <div class="h-8 w-64 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div class="flex flex-wrap gap-3">
            <div class="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div class="h-5 w-16 rounded bg-gray-200 dark:bg-gray-800" />
            <div class="h-5 w-24 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div class="flex gap-2">
          <div class="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div class="h-8 w-20 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <div v-for="i in 4" :key="i" class="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="i in 4" :key="i" class="h-64 rounded-xl bg-gray-200 dark:bg-gray-800" />
    </div>

    <div class="space-y-4">
      <div class="h-6 w-28 rounded bg-gray-200 dark:bg-gray-800" />
      <div class="space-y-2">
        <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div class="h-4 w-11/12 rounded bg-gray-200 dark:bg-gray-800" />
        <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>

    <div class="space-y-4">
      <div class="h-6 w-24 rounded bg-gray-200 dark:bg-gray-800" />
      <div class="space-y-2">
        <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  </div>
</template>

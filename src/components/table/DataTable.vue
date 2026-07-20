<template>
  <div class="overflow-hidden rounded-xl border dark:border-gray-800">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 font-medium text-gray-600 dark:text-gray-400"
              :class="col.class"
            >
              {{ col.label }}
            </th>
            <th
              v-if="$slots.actions"
              class="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-gray-800">
          <tr
            v-for="row in data"
            :key="String(row[trackBy])"
            class="hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <td v-for="col in columns" :key="col.key" class="px-4 py-3" :class="col.class">
              <slot :name="`cell-${col.key}`" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="px-4 py-3 text-right">
              <slot name="actions" :row="row" />
            </td>
          </tr>
          <tr v-if="!data.length">
            <td
              :colspan="columns.length + ($slots.actions ? 1 : 0)"
              class="px-4 py-8 text-center text-gray-500"
            >
              {{ emptyText }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
  class?: string
}

interface Props {
  columns: Column[]
  data: Record<string, unknown>[]
  trackBy?: string
  emptyText?: string
}

withDefaults(defineProps<Props>(), {
  trackBy: 'id',
  emptyText: 'Tidak ada data',
})
</script>

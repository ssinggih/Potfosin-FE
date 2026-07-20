<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="name" class="text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <Field
      :id="name"
      :name="name"
      :type="type === 'select' ? undefined : type"
      :as="componentTag"
      :class="
        cn(
          'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500',
          type === 'textarea' && 'h-auto min-h-[80px]',
          fieldError && 'border-red-500 focus:ring-red-500',
        )
      "
      :placeholder="type !== 'select' ? placeholder : undefined"
    >
      <slot />
    </Field>
    <ErrorMessage :name="name" class="text-xs text-red-500" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Field, ErrorMessage, useField } from 'vee-validate'
import { cn } from '@/utils/cn'

interface Props {
  name: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
})

const { errorMessage: fieldError } = useField(() => props.name)

const componentTag = computed(() => {
  if (props.type === 'textarea') return 'textarea'
  if (props.type === 'select') return 'select'
  return 'input'
})
</script>

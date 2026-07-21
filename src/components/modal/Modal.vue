<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')" />
        <div
          :class="
            cn(
              'relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-xl border bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900',
              'p-4 sm:p-6',
              maxWidth,
            )
          "
        >
          <div v-if="title" class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              {{ title }}
            </h3>
            <button
              class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              @click="$emit('close')"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { cn } from '@/utils/cn'

interface Props {
  open: boolean
  title?: string
  maxWidth?: string
}

withDefaults(defineProps<Props>(), {
  maxWidth: 'max-w-lg',
})

defineEmits<{ close: [] }>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

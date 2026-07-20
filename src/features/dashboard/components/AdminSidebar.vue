<template>
  <aside
    class="hidden w-64 border-r bg-white lg:flex lg:flex-col dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="flex h-16 items-center gap-2.5 border-b px-6 dark:border-gray-800">
      <div
        class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white"
      >
        P
      </div>
      <span class="text-lg font-bold">Portfosin</span>
    </div>

    <nav class="flex-1 space-y-4 p-4">
      <div>
        <p
          class="mb-2 px-3 text-[11px] font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500"
        >
          Menu
        </p>
        <div class="flex flex-col gap-1">
          <button
            v-for="item in menu"
            :key="item.key"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
            :class="
              activeTab === item.key
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            "
            @click="selectTab(item.key)"
          >
            <span
              class="flex h-7 w-7 items-center justify-center rounded-md"
              :class="
                activeTab === item.key
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              "
            >
              <component :is="item.icon" class="h-4 w-4" />
            </span>
            {{ item.label }}
          </button>
        </div>
      </div>
    </nav>

    <div class="border-t p-4 dark:border-gray-800">
      <router-link
        to="/"
        class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <ArrowLeft class="h-4 w-4" />
        Kembali
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { LayoutDashboard, FolderGit2, Code2, ImageIcon, ArrowLeft } from 'lucide-vue-next'

interface Props {
  activeTab: string
}

defineProps<Props>()

const emit = defineEmits<{
  navigate: [tab: string]
}>()

const menu = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'projects', label: 'Projects', icon: FolderGit2 },
  { key: 'techs', label: 'Techs', icon: Code2 },
  { key: 'images', label: 'Images', icon: ImageIcon },
]

function selectTab(key: string) {
  emit('navigate', key)
}
</script>

<template>
  <aside
    class="fixed top-16 left-0 z-30 hidden h-[calc(100vh-4rem)] w-64 border-r bg-white lg:block dark:border-gray-800 dark:bg-gray-950"
  >
    <nav class="flex flex-col gap-1 p-4">
      <router-link
        v-for="item in sidebarItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        active-class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <component :is="item.icon" class="h-4 w-4" />
        {{ item.label }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { LayoutDashboard, FolderGit2, Code2, Users } from 'lucide-vue-next'

const sidebarItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', path: '/projects', icon: FolderGit2 },
  { label: 'Techs', path: '/techs', icon: Code2 },
  { label: 'Users', path: '/users', icon: Users },
]
</script>

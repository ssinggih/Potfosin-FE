<template>
  <header
    class="fixed top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <router-link
        to="/"
        class="text-xl font-bold tracking-tight transition-colors hover:text-blue-600"
      >
        Portfosin
      </router-link>

      <nav class="hidden items-center gap-6 md:flex">
        <button
          v-for="item in NAV_ITEMS"
          :key="item.section"
          class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          @click="scrollToSection(item.section)"
        >
          {{ localeStore.locale === 'id' ? item.label : item.labelEn }}
        </button>
      </nav>

      <div class="flex items-center gap-3">
        <button
          class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800"
          @click="isMobileOpen = !isMobileOpen"
        >
          <Menu v-if="!isMobileOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </button>

        <template v-if="authStore.isAuthenticated">
          <span class="hidden text-sm text-gray-600 md:inline dark:text-gray-400">
            {{ authStore.user?.name }}
          </span>
          <button
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            @click="router.push('/dashboard')"
          >
            Dashboard
          </button>
        </template>
        <button
          v-else
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          @click="emit('openLogin')"
        >
          {{ $t('auth.login') }}
        </button>
      </div>
    </div>

    <Transition name="mobile">
      <div v-if="isMobileOpen" class="border-t px-4 pt-2 pb-4 md:hidden dark:border-gray-800">
        <nav class="flex flex-col gap-2">
          <button
            v-for="item in NAV_ITEMS"
            :key="item.section"
            class="rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            @click="
              () => {
                scrollToSection(item.section)
                isMobileOpen = false
              }
            "
          >
            {{ localeStore.locale === 'id' ? item.label : item.labelEn }}
          </button>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@features/auth'
import { useLocaleStore } from '@/stores/localeStore'
import { NAV_ITEMS } from '@/constants'
import { Menu, X } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'openLogin'): void
}>()
const router = useRouter()
const authStore = useAuthStore()
const localeStore = useLocaleStore()
const isMobileOpen = ref(false)

function scrollToSection(section: string) {
  if (router.currentRoute.value.path !== '/') {
    router.push(`/#${section}`)
    return
  }
  const el = document.getElementById(section)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.mobile-enter-active,
.mobile-leave-active {
  transition: all 0.2s ease;
}
.mobile-enter-from,
.mobile-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

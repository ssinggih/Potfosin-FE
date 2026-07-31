<template>
  <header
    class="fixed top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950/80"
    :class="isScrolled ? 'border-b shadow-sm' : ''"
  >
    <div
      class="mx-auto flex items-center justify-between px-4 transition-all duration-300 ease-in-out sm:px-6 lg:px-8"
      :class="isScrolled ? 'h-14 max-w-7xl' : 'h-16 max-w-7xl'"
    >
      <router-link
        to="/"
        class="font-bold tracking-tight transition-all duration-300 hover:text-blue-600"
        :class="isScrolled ? 'text-lg' : 'text-xl'"
      >
        Portfosin
      </router-link>

      <nav class="relative hidden items-center gap-6 md:flex">
        <div
          class="absolute bottom-0 h-0.5 rounded-full bg-blue-600 transition-all duration-300 ease-in-out"
          :style="indicatorStyle"
        />
        <button
          v-for="(item, index) in NAV_ITEMS"
          :key="item.section"
          :ref="(el) => setNavRef(el as HTMLElement, index)"
          class="relative py-1 text-sm font-medium transition-colors duration-200"
          :class="
            activeSection === item.section
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
          "
          @click="scrollToSection(item.section)"
        >
          {{ $t(`nav.${item.key}`) }}
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
            {{ $t(`nav.${item.key}`) }}
          </button>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@features/auth'
import { useLocaleStore } from '@/stores/localeStore'
import { NAV_ITEMS, SECTION_IDS } from '@/constants'
import { Menu, X } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'openLogin'): void
}>()
const router = useRouter()
const authStore = useAuthStore()
const localeStore = useLocaleStore()
const isMobileOpen = ref(false)
const isScrolled = ref(false)
const activeSection = ref(SECTION_IDS.HERO)

const navRefs = ref<(HTMLElement | null)[]>([])
const navPositions = reactive<{ left: number; width: number }[]>([])

function setNavRef(el: HTMLElement | null, index: number) {
  navRefs.value[index] = el
}

const indicatorStyle = computed(() => {
  const activeIndex = NAV_ITEMS.findIndex((item) => item.section === activeSection.value)
  if (activeIndex === -1 || !navPositions[activeIndex]) {
    return { left: '0px', width: '0px', opacity: '0' }
  }
  const pos = navPositions[activeIndex]
  return {
    left: `${pos.left}px`,
    width: `${pos.width}px`,
    opacity: '1',
  }
})

function updateNavPositions() {
  navRefs.value.forEach((el, index) => {
    if (el) {
      const rect = el.getBoundingClientRect()
      const parentRect = el.parentElement?.getBoundingClientRect()
      if (parentRect) {
        navPositions[index] = {
          left: rect.left - parentRect.left,
          width: rect.width,
        }
      }
    }
  })
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20
  updateActiveSection()
}

function updateActiveSection() {
  const sections: string[] = Object.values(SECTION_IDS)
  const scrollPosition = window.scrollY + 100

  for (let i = sections.length - 1; i >= 0; i--) {
    const sectionId = sections[i]
    if (!sectionId) continue
    const section = document.getElementById(sectionId)
    if (section && section.offsetTop <= scrollPosition) {
      activeSection.value = sectionId as typeof activeSection.value
      break
    }
  }
}

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

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  nextTick(() => {
    updateNavPositions()
    updateActiveSection()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(
  () => localeStore.locale,
  () => {
    nextTick(() => {
      updateNavPositions()
    })
  },
)
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

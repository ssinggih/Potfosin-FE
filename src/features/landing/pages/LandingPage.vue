<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { projectsApi } from '@/api/projects.api'
import { techsApi } from '@/api/techs.api'
import { SECTION_IDS } from '@/constants'
import AppHeader from '@components/layout/AppHeader.vue'
import AppFooter from '@components/layout/AppFooter.vue'
import ProjectCard from '@features/projects/components/ProjectCard.vue'
import LoginModal from '@features/auth/components/LoginModal.vue'
import SkeletonCard from '@components/ui/SkeletonCard.vue'
import SkeletonTech from '@components/ui/SkeletonTech.vue'
import {
  Mail,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  MapPin,
  Download,
} from 'lucide-vue-next'

const router = useRouter()
const showLogin = ref(false)

const projectsQuery = useQuery({
  queryKey: ['projects'],
  queryFn: async () => {
    const { data } = await projectsApi.getAll()
    return data
  },
})

const techsQuery = useQuery({
  queryKey: ['techs'],
  queryFn: async () => {
    const { data } = await techsApi.getAll()
    return data.data
  },
})

const projects = computed(() => {
  const list = projectsQuery.data.value?.data ?? []
  return [...list].sort((a, b) => b.priority - a.priority)
})
const techs = computed(() => techsQuery.data.value ?? [])

const projectsError = computed(() => (projectsQuery.isError.value ? 'Gagal memuat proyek' : null))
const techsError = computed(() => (techsQuery.isError.value ? 'Gagal memuat teknologi' : null))

function onLoginSuccess() {
  showLogin.value = false
  router.push('/dashboard')
}

function onTechIconError(e: Event) {
  const img = e.target as HTMLImageElement
  const name = img.alt
  const initial = name.charAt(0).toUpperCase()
  const colors = [
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#ef4444',
    '#6366f1',
    '#14b8a6',
  ]
  const color = colors[name.length % colors.length] ?? '#3b82f6'
  img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='${encodeURIComponent(color)}'/%3E%3Ctext x='16' y='22' text-anchor='middle' font-family='Arial,sans-serif' font-size='16' font-weight='bold' fill='white'%3E${initial}%3C/text%3E%3C/svg%3E`
}

function onProfileImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='16' fill='%233b82f6'/%3E%3Ctext x='40' y='52' text-anchor='middle' font-family='Arial,sans-serif' font-size='32' font-weight='bold' fill='white'%3ESA%3C/text%3E%3C/svg%3E`
}

const ITEMS_PER_PAGE = 3
const currentIndex = ref(0)
const showAllProjects = ref(false)
const slideDirection = ref<'left' | 'right'>('left')

const visibleProjects = computed(() => {
  if (showAllProjects.value) return projects.value
  return projects.value.slice(currentIndex.value, currentIndex.value + ITEMS_PER_PAGE)
})

const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value + ITEMS_PER_PAGE < projects.value.length)

const slideOffset = computed(() => (slideDirection.value === 'left' ? 60 : -60))

const gridKey = computed(() => (showAllProjects.value ? 'all' : `page-${currentIndex.value}`))

function goPrev() {
  slideDirection.value = 'right'
  currentIndex.value = Math.max(0, currentIndex.value - ITEMS_PER_PAGE)
}

function goNext() {
  slideDirection.value = 'left'
  const next = currentIndex.value + ITEMS_PER_PAGE
  if (next < projects.value.length) currentIndex.value = next
}

function toggleView() {
  showAllProjects.value = !showAllProjects.value
  currentIndex.value = 0
}
</script>

<template>
  <div class="bg-white dark:bg-gray-950">
    <AppHeader @open-login="showLogin = true" />

    <section id="hero" class="flex min-h-screen w-full items-center justify-center px-4">
      <div class="max-w-3xl text-center">
        <h1 class="text-5xl font-bold tracking-tight sm:text-6xl">
          <span class="text-blue-600">{{ $t('landing.greeting') }}</span>
        </h1>
        <p class="mx-auto mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400">
          {{ $t('landing.subtitle') }}
        </p>
        <div class="mt-8 flex justify-center gap-4">
          <a
            :href="`#${SECTION_IDS.PROJECTS}`"
            class="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            {{ $t('landing.viewProjects') }}
          </a>
          <a
            :href="`#${SECTION_IDS.TECHS}`"
            class="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            {{ $t('landing.viewTechs') }}
          </a>
        </div>
      </div>
    </section>

    <section
      :id="SECTION_IDS.PROJECTS"
      class="flex min-h-screen w-full items-center px-4 py-20 sm:px-6 lg:px-8"
    >
      <div class="mx-auto w-full max-w-6xl">
        <h2 class="mb-2 text-center text-3xl font-bold">
          {{ $t('landing.projects') }}
        </h2>
        <p class="mb-4 text-center text-gray-500 dark:text-gray-400">
          {{ $t('landing.projectsDesc') }}
        </p>

        <div
          v-if="projects.length > ITEMS_PER_PAGE"
          class="mb-8 flex items-center justify-center gap-4"
        >
          <button
            v-if="!showAllProjects"
            class="rounded-full border p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            :disabled="!hasPrev"
            @click="goPrev"
          >
            <ChevronLeft class="h-5 w-5" />
          </button>

          <button
            class="rounded-full border p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            :title="showAllProjects ? 'Tampilkan 3' : 'Lihat Semua'"
            @click="toggleView"
          >
            <Transition name="icon-spin" mode="out-in">
              <LayoutGrid v-if="showAllProjects" key="grid" class="h-5 w-5" />
              <List v-else key="list" class="h-5 w-5" />
            </Transition>
          </button>

          <button
            v-if="!showAllProjects"
            class="rounded-full border p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            :disabled="!hasNext"
            @click="goNext"
          >
            <ChevronRight class="h-5 w-5" />
          </button>
        </div>

        <div v-if="projectsQuery.isPending.value" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard v-for="i in 6" :key="i" />
        </div>
        <div v-else-if="projectsError" class="py-12 text-center text-red-500">
          {{ projectsError }}
        </div>
        <Transition v-else name="slide" mode="out-in">
          <div
            :key="gridKey"
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            :style="{ '--slide-x': slideOffset + 'px' }"
          >
            <ProjectCard v-for="project in visibleProjects" :key="project.id" :project="project" />
          </div>
        </Transition>
      </div>
    </section>

    <section
      :id="SECTION_IDS.TECHS"
      class="flex min-h-screen w-full items-center bg-gray-50 px-4 py-20 sm:px-6 lg:px-8 dark:bg-gray-900"
    >
      <div class="mx-auto w-full max-w-4xl">
        <h2 class="mb-2 text-center text-3xl font-bold">
          {{ $t('landing.techs') }}
        </h2>
        <p class="mb-12 text-center text-gray-500 dark:text-gray-400">
          {{ $t('landing.techsDesc') }}
        </p>
        <div v-if="techsQuery.isPending.value" class="flex flex-wrap justify-center gap-6">
          <SkeletonTech v-for="i in 8" :key="i" />
        </div>
        <div v-else-if="techsError" class="py-12 text-center text-red-500">
          {{ techsError }}
        </div>
        <div v-else class="flex flex-wrap justify-center gap-6">
          <div
            v-for="tech in techs"
            :key="tech.id"
            class="flex w-28 flex-col items-center gap-3 rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-950"
          >
            <img
              v-if="tech.icon_url"
              :src="tech.icon_url"
              :alt="tech.name"
              class="h-8 w-8 object-contain"
              @error="onTechIconError"
            />
            <span
              v-else
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              >{{ tech.name.charAt(0).toUpperCase() }}</span
            >
            <span class="text-center text-sm font-medium text-gray-700 dark:text-gray-300">{{
              tech.name
            }}</span>
          </div>
        </div>
      </div>
    </section>

    <section
      :id="SECTION_IDS.CONTACT"
      class="flex min-h-screen w-full items-center bg-white px-4 py-20 sm:px-6 lg:px-8 dark:bg-gray-950"
    >
      <div class="mx-auto w-full max-w-4xl">
        <h2 class="mb-2 text-center text-3xl font-bold">
          {{ $t('landing.contact') }}
        </h2>
        <p class="mb-12 text-center text-gray-500 dark:text-gray-400">
          {{ $t('landing.contactDesc') }}
        </p>

        <div
          class="flex flex-col items-center gap-8 rounded-2xl border bg-gray-50 p-8 shadow-sm sm:flex-row sm:items-start sm:p-10 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="shrink-0">
            <img
              src="https://pub-3a7d8dbbcc014b04a39701b84884e71c.r2.dev/AI%20Removal-Manual-AI%20Removal-Manual-Quality%20Restor.jpeg"
              :alt="$t('landing.profileName')"
              class="h-32 w-32 rounded-2xl border-2 border-white object-cover shadow-lg sm:h-40 sm:w-40 dark:border-gray-700"
              @error="onProfileImgError"
            />
          </div>

          <div class="flex-1 text-center sm:text-left">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ $t('landing.profileName') }}
            </h3>
            <p class="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              {{ $t('landing.profileRole') }}
            </p>

            <div
              class="mt-2 inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
            >
              <MapPin class="h-3.5 w-3.5" />
              {{ $t('landing.profileLocation') }}
            </div>

            <p class="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {{ $t('landing.profileBio') }}
            </p>

            <div class="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
              <a
                href="mailto:sing.work@gmail.com"
                class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <Mail class="h-4 w-4" />
                sing.work@gmail.com
              </a>
              <a
                href="https://pub-3a7d8dbbcc014b04a39701b84884e71c.r2.dev/CV_ATS_MUHAMAD%20SINGGIH.pdf"
                target="_blank"
                class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Download class="h-4 w-4" />
                {{ $t('landing.viewCV') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />

    <LoginModal :open="showLogin" @close="showLogin = false" @success="onLoginSuccess" />
  </div>
</template>

<style scoped>
.slide-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from {
  transform: translateX(var(--slide-x));
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(calc(var(--slide-x) * -1));
  opacity: 0;
}

.icon-spin-enter-active,
.icon-spin-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.icon-spin-enter-from {
  transform: rotate(90deg) scale(0.5);
  opacity: 0;
}
.icon-spin-leave-to {
  transform: rotate(-90deg) scale(0.5);
  opacity: 0;
}
</style>

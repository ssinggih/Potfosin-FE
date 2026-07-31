<template>
  <Card
    class="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    @click="goToDetail"
  >
    <div v-if="mockupImage" class="relative h-44 overflow-hidden">
      <img
        :src="proxyR2Url(mockupImage.url)"
        :alt="project.name"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        @error="onImgError"
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
      <div class="absolute top-2 right-2 flex gap-1.5">
        <span
          class="rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm backdrop-blur-sm"
          :class="priorityClass"
        >
          {{ project.priority }}
        </span>
        <span
          class="rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm backdrop-blur-sm"
          :class="statusStyles[project.status]"
        >
          {{ project.status }}
        </span>
      </div>
    </div>

    <div>
      <div class="mb-3">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100">
          {{ project.name }}
        </h3>
        <p class="mt-0.5 text-xs text-gray-500">
          {{ project.teamType }} &middot; {{ formatDate(project.createdAt) }}
        </p>
        <p
          v-if="project.role"
          class="mt-1 inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
        >
          {{ project.role }}
        </p>
        <p v-if="project.startDate || project.endDate" class="mt-0.5 text-xs text-gray-400">
          <template v-if="project.startDate">
            {{ formatDate(project.startDate) }}
          </template>
          <template v-if="project.startDate && project.endDate"> — </template>
          <template v-if="project.endDate">
            {{ formatDate(project.endDate) }}
          </template>
        </p>
      </div>

      <p
        v-if="!mockupImage"
        class="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400"
      >
        {{ project.description }}
      </p>

      <div v-if="project.techs.length" class="flex flex-wrap gap-1.5">
        <span
          v-for="tech in project.techs.slice(0, 4)"
          :key="tech.id"
          class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
        >
          <img
            v-if="tech.icon_url"
            :src="proxyR2Url(tech.icon_url)"
            :alt="tech.name"
            class="h-3.5 w-3.5 object-contain"
            @error="onImgError"
          />
          <span
            v-else
            class="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-blue-100 text-[9px] font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            >{{ tech.name.charAt(0).toUpperCase() }}</span
          >
          {{ tech.name }}
        </span>
        <span
          v-if="project.techs.length > 4"
          class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-500"
        >
          +{{ project.techs.length - 4 }}
        </span>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Project } from '@/api/projects.api'
import { Card } from '@components/cards'
import { formatDate } from '@/utils/format'
import { proxyR2Url } from '@/utils/proxy'

interface Props {
  project: Project
}

const props = defineProps<Props>()
const router = useRouter()

const mockupImage = computed(() => props.project.images?.find((img) => img.type === 'mockup'))

const priorityClass = computed(() => {
  const p = props.project.priority
  if (p >= 80) return 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'
  if (p >= 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
})

function goToDetail() {
  router.push({ name: 'project-detail', params: { id: props.project.id } })
}

function onImgError(e: Event) {
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

const statusStyles: Record<string, string> = {
  complete: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
}
</script>

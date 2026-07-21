<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        class="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        @click="router.back()"
      >
        <ChevronLeft class="h-4 w-4" />
        Back
      </button>

      <div v-if="isLoading" class="py-8">
        <SkeletonDetail />
      </div>

      <template v-else-if="project">
        <div
          class="mb-8 overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div v-if="mockupImage" class="relative h-56 overflow-hidden sm:h-72">
            <img
              :src="proxyR2Url(mockupImage.url)"
              :alt="project.name"
              class="h-full w-full object-cover"
              @error="onGalleryImgError"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            />
            <div class="absolute right-4 bottom-4 left-4 sm:bottom-6 sm:left-6">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="rounded-full px-3 py-0.5 text-xs font-medium shadow-sm backdrop-blur-sm"
                  :class="statusClass(project.status)"
                >
                  {{ project.status }}
                </span>
                <span
                  v-if="project.teamType"
                  class="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm"
                >
                  <Users class="mr-1 inline h-3 w-3" />
                  {{ project.teamType }}
                </span>
              </div>
              <h1 class="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {{ project.name }}
              </h1>
              <p v-if="project.startDate" class="mt-1 text-sm text-white/80">
                <Calendar class="mr-1.5 inline h-4 w-4" />
                {{ formatDate(project.startDate) }}
                <template v-if="project.endDate"> — {{ formatDate(project.endDate) }} </template>
                <template v-else> — Sekarang </template>
              </p>
            </div>
          </div>

          <div :class="mockupImage ? 'p-6' : 'p-6'">
            <div v-if="!mockupImage" class="mb-4">
              <div class="mb-2 flex flex-wrap items-center gap-2">
                <span
                  class="rounded-full px-3 py-0.5 text-xs font-medium"
                  :class="statusClass(project.status)"
                >
                  {{ project.status }}
                </span>
                <span class="text-xs text-gray-500">
                  <Users class="mr-1 inline h-3 w-3" />
                  {{ project.teamType }}
                </span>
              </div>
              <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
                {{ project.name }}
              </h1>
              <p v-if="project.startDate" class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Calendar class="mr-1.5 inline h-4 w-4" />
                {{ formatDate(project.startDate) }}
                <template v-if="project.endDate"> — {{ formatDate(project.endDate) }} </template>
                <template v-else> — Sekarang </template>
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <Button
                v-if="project.githubLink"
                variant="outline"
                size="sm"
                as="a"
                :href="project.githubLink"
                target="_blank"
              >
                <Github class="h-4 w-4" />
                GitHub
              </Button>
              <Button
                v-if="project.designLink"
                variant="outline"
                size="sm"
                as="a"
                :href="project.designLink"
                target="_blank"
              >
                <Figma class="h-4 w-4" />
                Design
              </Button>
            </div>

            <div class="mt-6 flex flex-wrap gap-2 border-t pt-6 dark:border-gray-800">
              <span
                v-for="tech in project.techs"
                :key="tech.id"
                class="inline-flex items-center gap-1.5 rounded-full border bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <img
                  v-if="tech.icon_url"
                  :src="proxyR2Url(tech.icon_url)"
                  :alt="tech.name"
                  class="h-3.5 w-3.5 object-contain"
                  @error="onTechIconError"
                />
                <span
                  v-else
                  class="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-blue-100 text-[9px] font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  >{{ tech.name.charAt(0).toUpperCase() }}</span
                >
                {{ tech.name }}
              </span>
            </div>
          </div>
        </div>

        <div class="mb-8 grid gap-6 lg:grid-cols-2">
          <div
            v-if="project.description"
            class="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <h2
              class="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              <span
                class="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                >i</span
              >
              Description
            </h2>
            <p class="leading-relaxed text-gray-700 dark:text-gray-300">
              {{ project.description }}
            </p>
          </div>

          <div
            v-if="project.experience"
            class="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <h2
              class="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              <span
                class="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-xs text-amber-600 dark:bg-amber-900 dark:text-amber-300"
                >*</span
              >
              Experience
            </h2>
            <p class="leading-relaxed text-gray-700 dark:text-gray-300">
              {{ project.experience }}
            </p>
          </div>
        </div>

        <div v-if="imagesLoading" class="flex items-center justify-center py-12">
          <Loader2 class="mr-2 h-5 w-5 animate-spin text-gray-400" />
          <span class="text-sm text-gray-500">Loading images...</span>
        </div>

        <div v-else-if="images?.length" class="mb-8">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Gallery
            <span class="ml-1 text-sm font-normal text-gray-400">({{ images.length }} photos)</span>
          </h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div
              v-for="img in images"
              :key="img.id"
              class="group relative cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800"
              @click="lightboxUrl = proxyR2Url(img.url)"
            >
              <img
                :src="proxyR2Url(img.url)"
                :alt="img.type"
                class="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                @error="onGalleryImgError"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div class="absolute bottom-3 left-3">
                <span
                  class="rounded-md bg-black/40 px-2 py-0.5 text-xs text-white/90 capitalize backdrop-blur-sm"
                >
                  {{ img.type }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="rounded-xl border bg-white p-12 text-center text-sm text-gray-400 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <ImageIcon class="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
          No images for this project yet.
        </div>
      </template>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="lightboxUrl"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          @click="lightboxUrl = ''"
        >
          <img
            :src="lightboxUrl"
            class="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            @click.stop
          />
          <button
            class="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            @click="lightboxUrl = ''"
          >
            <X class="h-6 w-6" />
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProject } from '../services/projectService'
import { useProjectImages } from '@features/uploads'
import { Button } from '@components/ui'
import SkeletonDetail from '@components/ui/SkeletonDetail.vue'
import { formatDate } from '@/utils/format'
import { proxyR2Url } from '@/utils/proxy'
import { ChevronLeft, Users, Calendar, Github, Figma, Loader2, ImageIcon, X } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const projectId = route.params.id as string
const { data: project, isLoading } = useProject(projectId)
const { data: images, isLoading: imagesLoading } = useProjectImages(projectId)

const lightboxUrl = ref('')

const mockupImage = computed(() => project.value?.images?.find((img) => img.type === 'mockup'))

function statusClass(status: string) {
  const map: Record<string, string> = {
    complete: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  }
  return map[status] || ''
}

function onGalleryImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
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

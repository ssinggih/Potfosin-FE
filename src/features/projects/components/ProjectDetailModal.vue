<template>
  <div v-if="project" class="max-h-[80vh] space-y-6 overflow-y-auto">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="space-y-1">
        <h2 class="text-xl font-bold">
          {{ project.name }}
        </h2>
        <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span
            class="rounded-full px-2.5 py-0.5 text-xs font-medium"
            :class="statusClass(project.status)"
          >
            {{ project.status }}
          </span>
          <span class="inline-flex items-center gap-1">
            <Users class="h-3.5 w-3.5" />
            {{ project.teamType }}
          </span>
          <span v-if="project.experience" class="inline-flex items-center gap-1">
            <Briefcase class="h-3.5 w-3.5" />
            {{ project.experience }}
          </span>
          <span class="inline-flex items-center gap-1">
            <Calendar class="h-3.5 w-3.5" />
            {{ project.priority }}
          </span>
        </div>
        <p v-if="project.startDate" class="text-xs text-gray-400">
          {{ formatDate(project.startDate) }}
          <template v-if="project.endDate"> — {{ formatDate(project.endDate) }} </template>
        </p>
      </div>
      <div class="flex gap-2">
        <Button
          v-if="project.githubLink"
          variant="outline"
          size="sm"
          as="a"
          :href="project.githubLink"
          target="_blank"
        >
          <Github class="h-3.5 w-3.5" />
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
          <Figma class="h-3.5 w-3.5" />
          Design
        </Button>
      </div>
    </div>

    <div v-if="project.description" class="space-y-1">
      <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-400">Description</h3>
      <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {{ project.description }}
      </p>
    </div>

    <div class="flex flex-wrap gap-1.5">
      <span
        v-for="t in project.techs"
        :key="t.id"
        class="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs dark:border-gray-700"
      >
        <img v-if="t.icon_url" :src="proxyR2Url(t.icon_url)" :alt="t.name" class="h-3.5 w-3.5" />
        {{ t.name }}
      </span>
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-400">
          Images
          <span v-if="images?.length" class="ml-1 text-xs font-normal text-gray-400"
            >({{ images?.length }})</span
          >
        </h3>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" :disabled="uploading" @click="mockupInput?.click()">
            <Upload class="h-3.5 w-3.5" />
            Mockup
          </Button>
          <input
            ref="mockupInput"
            type="file"
            accept="image/*"
            class="hidden"
            :disabled="uploading"
            @change="onUploadMockup"
          />
          <Button variant="outline" size="sm" :disabled="uploading" @click="postInput?.click()">
            <Upload class="h-3.5 w-3.5" />
            Post
          </Button>
          <input
            ref="postInput"
            type="file"
            accept="image/*"
            class="hidden"
            :disabled="uploading"
            @change="onUploadPost"
          />
        </div>
      </div>

      <div v-if="imagesLoading" class="flex items-center justify-center py-8 text-sm text-gray-500">
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        Loading images...
      </div>

      <div v-else-if="images?.length" class="grid gap-3 sm:grid-cols-2">
        <div
          v-for="img in images"
          :key="img.id"
          class="group relative overflow-hidden rounded-xl border dark:border-gray-700"
        >
          <img
            :src="proxyR2Url(img.url)"
            :alt="img.type"
            class="h-48 w-full object-cover transition-transform group-hover:scale-105"
          />
          <div
            class="absolute inset-0 flex items-start justify-between bg-black/0 p-2 transition-colors group-hover:bg-black/40"
          >
            <span class="rounded bg-black/60 px-2 py-0.5 text-xs text-white capitalize">
              {{ img.type }}
            </span>
            <button
              class="rounded-lg bg-red-600/80 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
              :disabled="deleting === img.id"
              @click="deleteImage(img.id)"
            >
              <Loader2 v-if="deleting === img.id" class="h-3.5 w-3.5 animate-spin" />
              <Trash2 v-else class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <p v-else class="py-4 text-center text-sm text-gray-400">
        No images yet. Upload a mockup or post image.
      </p>
    </div>
  </div>
  <div v-else class="flex items-center justify-center py-12">
    <Loader2 class="h-5 w-5 animate-spin text-gray-400" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProject } from '../services/projectService'
import { useProjectImages, useUploadMockup, useUploadPost, useDeleteImage } from '@features/uploads'
import { Button } from '@components/ui'
import { formatDate } from '@/utils/format'
import { proxyR2Url } from '@/utils/proxy'
import { Users, Briefcase, Github, Figma, Calendar, Upload, Trash2, Loader2 } from 'lucide-vue-next'

interface Props {
  projectId: string
}

const props = defineProps<Props>()

const { data: project } = useProject(props.projectId)
const { data: images, isLoading: imagesLoading } = useProjectImages(props.projectId)
const { mutateAsync: uploadMockup, isPending: uploadingMockup } = useUploadMockup()
const { mutateAsync: uploadPost, isPending: uploadingPost } = useUploadPost()
const { mutateAsync: deleteImageMutate } = useDeleteImage()

const mockupInput = ref<HTMLInputElement | null>(null)
const postInput = ref<HTMLInputElement | null>(null)
const uploading = computed(() => uploadingMockup.value || uploadingPost.value)
const deleting = ref('')

function statusClass(status: string) {
  const map: Record<string, string> = {
    complete: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  }
  return map[status] || ''
}

async function onUploadMockup(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    await uploadMockup({ projectId: props.projectId, file })
  } catch (e: any) {
    alert(e?.response?.data?.message || e?.message || 'Gagal upload mockup')
  }
  input.value = ''
}

async function onUploadPost(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    await uploadPost({ projectId: props.projectId, file })
  } catch (e: any) {
    alert(e?.response?.data?.message || e?.message || 'Gagal upload post')
  }
  input.value = ''
}

async function deleteImage(imageId: string) {
  if (!confirm('Hapus gambar ini?')) return
  deleting.value = imageId
  try {
    await deleteImageMutate(imageId)
    alert('Gambar berhasil dihapus!')
  } catch (e: any) {
    alert(e?.response?.data?.message || e?.message || 'Gagal hapus gambar')
  } finally {
    deleting.value = ''
  }
}
</script>

<template>
  <div>
    <!-- Upload Area -->
    <div
      class="mb-8 rounded-xl border-2 border-dashed p-6 transition-colors dark:border-gray-700"
      :class="
        isDragOver
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600'
      "
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="onDrop"
    >
      <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative w-60">
            <div
              class="flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-950"
              @click="showProjectDropdown = !showProjectDropdown"
            >
              <Search class="h-4 w-4 shrink-0 text-gray-400" />
              <span v-if="selectedProjectId" class="font-medium text-blue-600 dark:text-blue-400">{{
                projectNames[selectedProjectId]
              }}</span>
              <span v-else class="text-gray-400">Pilih project</span>
              <ChevronDown class="ml-auto h-4 w-4 text-gray-400" />
            </div>
            <Transition name="dropdown">
              <div
                v-if="showProjectDropdown"
                class="absolute top-full right-0 left-0 z-10 mt-1 rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-950"
              >
                <div class="border-b p-2 dark:border-gray-700">
                  <input
                    v-model="projectSearch"
                    type="text"
                    placeholder="Cari project..."
                    class="w-full rounded-md border bg-gray-50 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                    @click.stop
                  />
                </div>
                <div class="max-h-48 overflow-y-auto">
                  <button
                    v-for="id in filteredProjectIds"
                    :key="id"
                    class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    :class="
                      id === selectedProjectId
                        ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300'
                    "
                    @click="selectProject(id)"
                  >
                    <Check
                      v-if="id === selectedProjectId"
                      class="h-3.5 w-3.5 shrink-0 text-blue-600"
                    />
                    {{ projectNames[id] }}
                  </button>
                  <p
                    v-if="!filteredProjectIds.length"
                    class="px-3 py-4 text-center text-xs text-gray-400"
                  >
                    Tidak ada project ditemukan
                  </p>
                </div>
              </div>
            </Transition>
          </div>
          <div class="flex rounded-lg border dark:border-gray-700">
            <button
              class="px-3 py-2 text-xs font-medium transition-colors"
              :class="
                uploadType === 'mockup'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 dark:bg-gray-950 dark:text-gray-400'
              "
              @click="uploadType = 'mockup'"
            >
              Mockup
            </button>
            <button
              class="px-3 py-2 text-xs font-medium transition-colors"
              :class="
                uploadType === 'post'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 dark:bg-gray-950 dark:text-gray-400'
              "
              @click="uploadType = 'post'"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      <div
        class="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl py-10 text-center transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
        @click="fileInput?.click()"
      >
        <Upload class="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
          {{ isDragOver ? 'Lepaskan file di sini' : 'Seret & lepas gambar, atau klik untuk pilih' }}
        </p>
        <p class="mt-1 text-xs text-gray-400">PNG, JPG, WebP</p>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          :disabled="uploading"
          @change="onFileSelected"
        />
      </div>

      <div
        v-if="selectedFile"
        class="mt-4 flex items-center gap-4 rounded-lg border bg-white p-3 dark:border-gray-700 dark:bg-gray-950"
      >
        <img :src="selectedFilePreview" class="h-14 w-14 rounded-lg object-cover" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium">
            {{ selectedFile.name }}
          </p>
          <p class="text-xs text-gray-400">{{ (selectedFile.size / 1024).toFixed(1) }} KB</p>
        </div>
        <Button v-if="!uploading" variant="outline" size="sm" @click="selectedFile = null">
          Batal
        </Button>
        <Button :disabled="uploading" size="sm" @click="startUpload">
          <Loader2 v-if="uploading" class="mr-1 h-3.5 w-3.5 animate-spin" />
          {{ uploading ? 'Mengupload...' : 'Upload' }}
        </Button>
      </div>

      <p v-if="uploadSuccess" class="mt-3 text-center text-sm text-green-600">
        Gambar berhasil diupload!
      </p>
    </div>

    <!-- Image Gallery -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold">All Images</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ totalImages }} image{{ totalImages !== 1 ? 's' : '' }} across
          {{ projectsWithImages }} project{{ projectsWithImages !== 1 ? 's' : '' }}
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center py-12 text-sm text-gray-500">
      <Loader2 class="mr-2 h-5 w-5 animate-spin" />
      Loading images...
    </div>

    <template v-else-if="groupedImages.length">
      <div v-for="group in groupedImages" :key="group.projectId" class="mb-8">
        <div class="mb-3 flex items-center gap-2">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {{ group.projectName }}
          </h3>
          <span
            class="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          >
            {{ group.images.length }}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="img in group.images"
            :key="img.id"
            class="group relative overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-950"
          >
            <img
              :src="proxyR2Url(img.url)"
              :alt="img.type"
              class="h-40 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
              @click="previewImage = proxyR2Url(img.url)"
              @error="onImgError"
            />
            <div class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30">
              <div class="flex items-start justify-between p-2">
                <span
                  class="rounded-md bg-black/60 px-2 py-0.5 text-xs text-white capitalize backdrop-blur-sm"
                >
                  {{ img.type }}
                </span>
                <button
                  type="button"
                  class="rounded-lg bg-red-600/80 p-1.5 text-white opacity-0 shadow-sm backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-red-600"
                  :disabled="deletingId === img.id"
                  @click="deleteImage(img.id)"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
              <div
                class="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/40 to-transparent p-2 pt-6"
              >
                <span class="text-xs text-white/80">{{ group.projectName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="flex flex-col items-center justify-center py-20 text-gray-400">
      <ImageIcon class="mb-4 h-16 w-16" />
      <p class="text-sm">Belum ada gambar</p>
      <p class="mt-1 text-xs">Upload gambar menggunakan form di atas</p>
    </div>

    <!-- Lightbox Preview -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="previewImage"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          @click="previewImage = ''"
        >
          <img
            :src="previewImage"
            class="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            @click.stop
          />
          <button
            class="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            @click="previewImage = ''"
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
import {
  useDeleteImage,
  useAllProjectImages,
  useUploadMockup,
  useUploadPost,
} from '@features/uploads'
import { Button } from '@components/ui'
import { proxyR2Url } from '@/utils/proxy'
import { ImageIcon, Loader2, Trash2, X, Upload, Search, ChevronDown, Check } from 'lucide-vue-next'

interface Props {
  projectIds: string[]
  projectNames: Record<string, string>
}

const props = defineProps<Props>()

const projectIdsRef = computed(() => props.projectIds)
const { data: groupedData, isLoading } = useAllProjectImages(projectIdsRef)
const { mutateAsync: deleteImageMutate } = useDeleteImage()
const { mutateAsync: uploadMockup, isPending: uploadingMockup } = useUploadMockup()
const { mutateAsync: uploadPost, isPending: uploadingPost } = useUploadPost()
const deletingId = ref('')
const previewImage = ref('')

const isDragOver = ref(false)
const selectedProjectId = ref('')
const uploadType = ref<'mockup' | 'post'>('mockup')
const fileInput = ref<HTMLInputElement | null>(null)
const projectSearch = ref('')
const showProjectDropdown = ref(false)

const filteredProjectIds = computed(() => {
  const q = projectSearch.value.toLowerCase()
  return props.projectIds.filter((id) => props.projectNames[id]?.toLowerCase().includes(q))
})

function selectProject(id: string) {
  selectedProjectId.value = id
  projectSearch.value = ''
  showProjectDropdown.value = false
}

const selectedFile = ref<File | null>(null)
const selectedFilePreview = ref('')
const uploadSuccess = ref(false)

const uploading = computed(() => uploadingMockup.value || uploadingPost.value)

const groupedImages = computed(() => {
  return groupedData.value
    .filter((g) => g.images.length > 0)
    .map((g) => ({
      projectId: g.projectId,
      projectName: props.projectNames[g.projectId] ?? 'Unknown',
      images: g.images,
    }))
})

const totalImages = computed(() => groupedImages.value.reduce((sum, g) => sum + g.images.length, 0))

const projectsWithImages = computed(() => groupedImages.value.length)

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

function onDrop(e: DragEvent) {
  isDragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    setSelectedFile(file)
  }
}

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    setSelectedFile(file)
  }
  input.value = ''
}

function setSelectedFile(file: File) {
  selectedFile.value = file
  selectedFilePreview.value = URL.createObjectURL(file)
  uploadSuccess.value = false
}

async function startUpload() {
  if (!selectedFile.value) {
    alert('Pilih file terlebih dahulu')
    return
  }
  if (!selectedProjectId.value) {
    alert('Pilih project terlebih dahulu')
    return
  }
  uploadSuccess.value = false
  try {
    if (uploadType.value === 'mockup') {
      await uploadMockup({ projectId: selectedProjectId.value, file: selectedFile.value })
    } else {
      await uploadPost({ projectId: selectedProjectId.value, file: selectedFile.value })
    }
    selectedFile.value = null
    selectedFilePreview.value = ''
    uploadSuccess.value = true
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } }; message?: string }
    alert(
      err?.response?.data?.message ||
        err?.message ||
        (uploadType.value === 'mockup' ? 'Gagal upload mockup' : 'Gagal upload post'),
    )
  }
}

async function deleteImage(imageId: string) {
  if (!confirm('Hapus gambar ini?')) return
  deletingId.value = imageId
  try {
    await deleteImageMutate(imageId)
    alert('Gambar berhasil dihapus!')
  } catch {
    alert('Gagal hapus gambar')
  } finally {
    deletingId.value = ''
  }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

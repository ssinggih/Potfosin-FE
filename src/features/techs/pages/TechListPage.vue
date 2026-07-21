<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Technologies</h1>
      <Button v-if="isAdmin" @click="isCreateOpen = true">
        <Plus class="h-4 w-4" />
        Add Tech
      </Button>
    </div>

    <div class="mb-4 flex items-center gap-3">
      <div class="relative max-w-sm flex-1">
        <Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Search tech..."
          class="w-full rounded-lg border bg-white py-2 pr-4 pl-9 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {{ filteredTechs.length }} tech{{ filteredTechs.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <div v-if="isLoading" class="py-12 text-center text-gray-500">Loading...</div>

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card v-for="tech in paginatedTechs" :key="tech.id" hoverable>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">
                {{ tech.name }}
              </h3>
              <div v-if="isAdmin" class="flex gap-1">
                <Button variant="ghost" size="sm" @click="editTech(tech)">
                  <Edit class="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" @click="confirmDelete(tech.id)">
                  <Trash2 class="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            </div>
          </template>
          <div class="flex items-center gap-3">
            <img
              v-if="tech.icon_url"
              :src="proxyR2Url(tech.icon_url)"
              :alt="tech.name"
              class="h-8 w-8 object-contain"
              @error="onTechIconError"
            />
            <span
              v-else
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
              >{{ tech.name.charAt(0).toUpperCase() }}</span
            >
            <span class="text-sm text-gray-600 dark:text-gray-400"> /{{ tech.slug }} </span>
          </div>
        </Card>
      </div>

      <div v-if="filteredTechs.length === 0" class="py-12 text-center text-sm text-gray-400">
        No tech found.
      </div>

      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" :disabled="!hasPrev" @click="prev">
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <Button variant="outline" size="sm" :disabled="!hasNext" @click="next">
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </template>

    <Modal :open="isCreateOpen || isEditOpen" title="Technology" @close="closeModal">
      <TechForm :tech="selectedTech" @submit="handleSubmit" @cancel="closeModal" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuth } from '@features/auth'
import { useTechs, useCreateTech, useUpdateTech, useDeleteTech } from '../services/techService'
import type { Tech } from '@/api/techs.api'
import { Button } from '@components/ui'
import { Card } from '@components/cards'
import { Modal } from '@components/modal'
import TechForm from '../components/TechForm.vue'
import { proxyR2Url } from '@/utils/proxy'
import { usePagination } from '@/composables/usePagination'
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { isAdmin } = useAuth()

const { data: techs, isLoading } = useTechs()
const { mutate: createTech } = useCreateTech()
const { mutate: updateTech } = useUpdateTech()
const { mutate: deleteTech } = useDeleteTech()

const isCreateOpen = ref(false)
const isEditOpen = ref(false)
const selectedTech = ref<Tech | null>(null)
const search = ref('')

const filteredTechs = computed(() => {
  const list = techs.value ?? []
  if (!search.value) return list
  const q = search.value.toLowerCase()
  return list.filter((t) => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q))
})

const { currentPage, totalPages, hasNext, hasPrev, next, prev } = usePagination(
  computed(() => filteredTechs.value.length),
  10,
)

watch(search, () => {
  currentPage.value = 1
})

const paginatedTechs = computed(() => {
  const start = (currentPage.value - 1) * 10
  return filteredTechs.value.slice(start, start + 10)
})

function editTech(tech: Tech) {
  selectedTech.value = tech
  isEditOpen.value = true
}

function closeModal() {
  isCreateOpen.value = false
  isEditOpen.value = false
  selectedTech.value = null
}

function handleSubmit(data: Record<string, unknown>) {
  if (selectedTech.value) {
    updateTech({
      id: selectedTech.value.id,
      data: data as { name: string; slug: string; icon_url: string },
    })
  } else {
    createTech(data as { name: string; slug: string; icon_url: string })
  }
  closeModal()
}

function confirmDelete(id: string) {
  if (confirm('Hapus tech ini?')) {
    deleteTech(id)
  }
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

<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-950">
    <AdminSidebar :active-tab="activeTab" @navigate="activeTab = $event" />
    <div class="flex flex-1 flex-col">
      <AdminHeader />
      <main class="flex-1 p-6">
        <div class="mx-auto max-w-6xl">
          <div class="mb-6 flex items-center justify-between">
            <div class="flex gap-4 border-b border-gray-200 dark:border-gray-800">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                class="border-b-2 px-4 py-3 text-sm font-medium transition-colors"
                :class="
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                "
                @click="activeTab = tab.key"
              >
                <component :is="tab.icon" class="mr-2 inline h-4 w-4" />
                {{ tab.label }}
              </button>
            </div>
            <div class="flex gap-3">
              <Button variant="outline" size="sm" @click="router.push('/')">
                <ArrowLeft class="h-4 w-4" />
                {{ $t('common.back') }}
              </Button>
              <Button variant="danger" size="sm" @click="handleLogout">
                <LogOut class="h-4 w-4" />
                {{ $t('common.logout') }}
              </Button>
            </div>
          </div>

          <!-- OVERVIEW TAB -->
          <div v-if="activeTab === 'overview'">
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card v-for="stat in stats" :key="stat.label">
                <template #header>
                  <component :is="stat.icon" class="h-6 w-6 text-blue-600" />
                </template>
                <p class="text-2xl font-bold">
                  {{ stat.value }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ stat.label }}
                </p>
              </Card>
            </div>
            <div class="mt-8 grid gap-6 lg:grid-cols-2">
              <Card>
                <template #header>
                  <h2 class="font-semibold">
                    {{ $t('dashboard.recentProjects') }}
                  </h2>
                </template>
                <div v-if="projectsLoading" class="py-4 text-sm text-gray-500">
                  {{ $t('common.loading') }}
                </div>
                <div v-else class="space-y-3">
                  <div
                    v-for="p in recentProjects"
                    :key="p.id"
                    class="flex items-center justify-between rounded-lg border px-4 py-3 dark:border-gray-800"
                  >
                    <span class="text-sm font-medium">{{ p.name }}</span>
                    <span
                      class="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {{ p.status }}
                    </span>
                  </div>
                  <p v-if="!recentProjects.length" class="py-4 text-sm text-gray-500">
                    {{ $t('common.no_data') }}
                  </p>
                </div>
              </Card>
              <Card>
                <template #header>
                  <h2 class="font-semibold">
                    {{ $t('dashboard.techStack') }}
                  </h2>
                </template>
                <div v-if="techsLoading" class="py-4 text-sm text-gray-500">
                  {{ $t('common.loading') }}
                </div>
                <div v-else class="flex flex-wrap gap-2">
                  <span
                    v-for="t in techList"
                    :key="t.id"
                    class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm dark:border-gray-700"
                  >
                    <img v-if="t.icon_url" :src="t.icon_url" :alt="t.name" class="h-4 w-4" />
                    {{ t.name }}
                  </span>
                  <p v-if="!techList.length" class="py-4 text-sm text-gray-500">
                    {{ $t('common.no_data') }}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          <!-- PROJECTS TAB -->
          <div v-if="activeTab === 'projects'">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-bold">
                {{ $t('dashboard.recentProjects') }}
              </h2>
              <Button @click="openProjectForm(null)">
                <Plus class="h-4 w-4" />
                Tambah Project
              </Button>
            </div>
            <div v-if="projectsLoading" class="py-12 text-center text-gray-500">
              {{ $t('common.loading') }}
            </div>
            <Card v-else class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                    <th class="px-4 py-3 font-medium text-gray-500">Nama</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Status</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Tipe</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Tech</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Priority</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Img</th>
                    <th class="px-4 py-3 font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(p, i) in projectList"
                    :key="p.id"
                    class="border-b transition-colors hover:bg-blue-50/50 dark:border-gray-800 dark:hover:bg-blue-950/20"
                    :class="
                      i % 2 === 0
                        ? 'bg-white dark:bg-gray-950'
                        : 'bg-gray-50/50 dark:bg-gray-900/30'
                    "
                  >
                    <td class="px-4 py-3 font-medium">
                      {{ p.name }}
                    </td>
                    <td class="px-4 py-3">
                      <span
                        class="rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm"
                        :class="statusClass(p.status)"
                      >
                        {{ p.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
                      >
                        <Users class="h-3 w-3" />
                        {{ p.teamType }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex max-w-[160px] flex-wrap gap-1">
                        <span
                          v-for="t in p.techs"
                          :key="t.id"
                          class="inline-flex items-center gap-1 rounded-md border bg-white px-1.5 py-0.5 text-[10px] dark:border-gray-700 dark:bg-gray-800"
                        >
                          <img
                            v-if="t.icon_url"
                            :src="t.icon_url"
                            :alt="t.name"
                            class="h-3.5 w-3.5 object-contain"
                            @error="onTechIconError"
                          />
                          <span
                            v-else
                            class="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-blue-100 text-[9px] font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                            >{{ t.name.charAt(0).toUpperCase() }}</span
                          >
                          {{ t.name }}
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center gap-1 text-xs font-medium"
                        :class="priorityClass(p.priority)"
                      >
                        {{ p.priority }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center gap-1 text-xs"
                        :class="
                          projectImageCount(p) > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-400'
                        "
                      >
                        <ImageIcon class="h-3.5 w-3.5" />
                        {{ projectImageCount(p) }}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex gap-1">
                        <Button variant="ghost" size="sm" @click="openProjectDetail(p.id)">
                          <Eye class="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" @click="openProjectForm(p)">
                          <Edit class="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" @click="confirmDeleteProject(p.id)">
                          <Trash2 class="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!projectList.length">
                    <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                      {{ $t('common.no_data') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          <!-- TECHS TAB -->
          <div v-if="activeTab === 'techs'">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-bold">Technologies</h2>
              <Button @click="openTechForm(null)">
                <Plus class="h-4 w-4" />
                Tambah Tech
              </Button>
            </div>

            <div class="mb-4 flex items-center gap-3">
              <div class="relative max-w-sm flex-1">
                <Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="techSearch"
                  type="text"
                  placeholder="Search tech..."
                  class="w-full rounded-lg border bg-white py-2 pr-4 pl-9 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ filteredTechs.length }} tech{{ filteredTechs.length !== 1 ? 's' : '' }}
              </span>
            </div>

            <div v-if="techsLoading" class="py-12 text-center text-gray-500">
              {{ $t('common.loading') }}
            </div>
            <template v-else>
              <Card class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                      <th class="px-4 py-3 font-medium text-gray-500">Nama</th>
                      <th class="px-4 py-3 font-medium text-gray-500">Slug</th>
                      <th class="px-4 py-3 font-medium text-gray-500">Icon</th>
                      <th class="px-4 py-3 font-medium text-gray-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="t in paginatedTechs"
                      :key="t.id"
                      class="border-b hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                    >
                      <td class="px-4 py-3 font-medium">
                        {{ t.name }}
                      </td>
                      <td class="px-4 py-3 text-gray-500">/{{ t.slug }}</td>
                      <td class="px-4 py-3">
                        <img
                          v-if="t.icon_url"
                          :src="proxyR2Url(t.icon_url)"
                          :alt="t.name"
                          class="h-6 w-6 object-contain"
                          @error="onTechIconError"
                        />
                        <span
                          v-else
                          class="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          >{{ t.name.charAt(0).toUpperCase() }}</span
                        >
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex gap-2">
                          <Button variant="ghost" size="sm" @click="openTechForm(t)">
                            <Edit class="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" @click="confirmDeleteTech(t.id)">
                            <Trash2 class="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="!filteredTechs.length">
                      <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                        {{ techSearch ? 'No tech found.' : $t('common.no_data') }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card>

              <div v-if="techTotalPages > 1" class="mt-4 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" :disabled="!techHasPrev" @click="techPrev">
                  <ChevronLeft class="h-4 w-4" />
                </Button>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ techCurrentPage }} / {{ techTotalPages }}
                </span>
                <Button variant="outline" size="sm" :disabled="!techHasNext" @click="techNext">
                  <ChevronRight class="h-4 w-4" />
                </Button>
              </div>
            </template>
          </div>

          <!-- IMAGES TAB -->
          <div v-if="activeTab === 'images'">
            <AdminImagesTab :project-ids="allProjectIds" :project-names="projectNameMap" />
          </div>
        </div>
      </main>
      <FloatingActions />
    </div>

    <!-- Project Form Modal -->
    <Modal
      :open="projectFormOpen"
      max-width="max-w-xl"
      :title="editingProject ? 'Edit Project' : 'Tambah Project'"
      @close="closeProjectForm"
    >
      <VeeForm
        :key="editingProject?.id || 'new'"
        :validation-schema="projectSchema"
        :initial-values="projectInitialValues"
        @submit="submitProject"
      >
        <div class="space-y-4">
          <FormField name="name" label="Nama Project" placeholder="Nama project" />
          <FormField
            name="description"
            label="Deskripsi"
            type="textarea"
            placeholder="Deskripsi project"
          />
          <div class="grid grid-cols-2 gap-4">
            <FormField name="status" label="Status" type="select">
              <option value="complete">Complete</option>
              <option value="progress">Progress</option>
              <option value="paused">Paused</option>
            </FormField>
            <FormField name="teamType" label="Team Type" type="select">
              <option value="solo">Solo</option>
              <option value="team">Team</option>
            </FormField>
          </div>
          <FormField
            name="experience"
            label="Pengalaman"
            type="textarea"
            placeholder="Ceritakan pengalamanmu"
          />
          <FormField
            name="githubLink"
            label="GitHub URL"
            type="url"
            placeholder="https://github.com/..."
          />
          <FormField
            name="designLink"
            label="Design URL"
            type="url"
            placeholder="https://figma.com/..."
          />
          <div class="grid grid-cols-3 gap-4">
            <FormField name="startDate" label="Start Date" type="date" />
            <FormField name="endDate" label="End Date" type="date" />
            <FormField name="priority" label="Prioritas (1-100)" type="number" placeholder="50" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Technologies</label
            >
            <div
              v-if="techList.length"
              class="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-lg border p-3 dark:border-gray-700"
            >
              <label
                v-for="t in techList"
                :key="t.id"
                class="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                :class="
                  selectedTechIds.includes(t.id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : ''
                "
              >
                <input
                  type="checkbox"
                  :value="t.id"
                  :checked="selectedTechIds.includes(t.id)"
                  class="sr-only"
                  @change="toggleTechId(t.id)"
                />
                <img v-if="t.icon_url" :src="t.icon_url" :alt="t.name" class="h-4 w-4" />
                {{ t.name }}
              </label>
            </div>
            <p v-else class="text-sm text-gray-500">Loading techs...</p>
          </div>

          <p
            v-if="projectError"
            class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400"
          >
            {{ projectError }}
          </p>

          <div class="flex justify-end gap-3 pt-4">
            <Button variant="outline" @click="closeProjectForm"> Batal </Button>
            <Button type="submit" :disabled="projectSubmitting">
              {{ projectSubmitting ? 'Menyimpan...' : editingProject ? 'Update' : 'Simpan' }}
            </Button>
          </div>
        </div>
      </VeeForm>
    </Modal>

    <!-- Tech Form Modal -->
    <Modal
      :open="techFormOpen"
      :title="editingTech ? 'Edit Tech' : 'Tambah Tech'"
      @close="closeTechForm"
    >
      <VeeForm
        :key="editingTech?.id || 'new-tech'"
        :validation-schema="techSchema"
        :initial-values="editingTech ?? undefined"
        @submit="submitTech"
      >
        <div class="space-y-4">
          <FormField name="name" label="Name" placeholder="React" />
          <FormField name="slug" label="Slug" placeholder="react" />
          <FormField
            name="icon_url"
            label="Icon URL / Data URI"
            type="text"
            placeholder="https://cdn.example.com/icon.svg"
          />
          <p
            v-if="techError"
            class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400"
          >
            {{ techError }}
          </p>
          <div class="flex justify-end gap-3 pt-4">
            <Button variant="outline" @click="closeTechForm"> Batal </Button>
            <Button type="submit" :disabled="techSubmitting">
              {{ techSubmitting ? 'Menyimpan...' : editingTech ? 'Update' : 'Simpan' }}
            </Button>
          </div>
        </div>
      </VeeForm>
    </Modal>

    <!-- Project Detail Modal -->
    <Modal :open="detailModalOpen" title="Detail Project" @close="detailModalOpen = false">
      <ProjectDetailModal v-if="detailProjectId" :project-id="detailProjectId" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Form as VeeForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useAuthStore } from '@features/auth'
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@features/projects'
import { useTechs, useCreateTech, useUpdateTech, useDeleteTech } from '@features/techs'
import type { Project } from '@/api/projects.api'
import type { Tech } from '@/api/techs.api'
import { Card } from '@components/cards'
import { Button } from '@components/ui'
import { Modal } from '@components/modal'
import FormField from '@components/form/FormField.vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import AdminHeader from '../components/AdminHeader.vue'
import FloatingActions from '@components/layout/FloatingActions.vue'
import ProjectDetailModal from '@features/projects/components/ProjectDetailModal.vue'
import AdminImagesTab from '../components/AdminImagesTab.vue'
import { proxyR2Url } from '@/utils/proxy'
import { usePagination } from '@/composables/usePagination'
import {
  FolderGit2,
  Code2,
  CheckCircle,
  Clock,
  ArrowLeft,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  ImageIcon,
  LayoutDashboard,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('overview')

const tabs = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'projects', label: 'Projects', icon: FolderGit2 },
  { key: 'techs', label: 'Techs', icon: Code2 },
  { key: 'images', label: 'Images', icon: ImageIcon },
]

const { data: projectsData, isLoading: projectsLoading } = useProjects()
const { data: techs, isLoading: techsLoading } = useTechs()
const { mutateAsync: createProject } = useCreateProject()
const { mutateAsync: updateProjectMutate } = useUpdateProject()
const { mutateAsync: deleteProjectMutate } = useDeleteProject()
const { mutateAsync: createTechMutate } = useCreateTech()
const { mutateAsync: updateTechMutate } = useUpdateTech()
const { mutateAsync: deleteTechMutate } = useDeleteTech()

const projectList = computed(() => projectsData.value?.data ?? [])
const techList = computed(() => techs.value ?? [])
const allProjectIds = computed(() => projectList.value.map((p) => p.id))
const projectNameMap = computed(() => {
  const map: Record<string, string> = {}
  for (const p of projectList.value) map[p.id] = p.name
  return map
})

const recentProjects = computed(() => projectList.value.slice(0, 5))

// ---- Tech Search & Pagination ----
const techSearch = ref('')

const filteredTechs = computed(() => {
  const list = techList.value
  if (!techSearch.value) return list
  const q = techSearch.value.toLowerCase()
  return list.filter((t) => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q))
})

const {
  currentPage: techCurrentPage,
  totalPages: techTotalPages,
  hasNext: techHasNext,
  hasPrev: techHasPrev,
  next: techNext,
  prev: techPrev,
} = usePagination(
  computed(() => filteredTechs.value.length),
  10,
)

watch(techSearch, () => {
  techCurrentPage.value = 1
})

const paginatedTechs = computed(() => {
  const start = (techCurrentPage.value - 1) * 10
  return filteredTechs.value.slice(start, start + 10)
})

const stats = computed(() => [
  { label: 'Total Projects', value: projectList.value.length, icon: FolderGit2 },
  { label: 'Techs', value: techList.value.length, icon: Code2 },
  {
    label: 'Completed',
    value: projectList.value.filter((p) => p.status === 'complete').length,
    icon: CheckCircle,
  },
  {
    label: 'In Progress',
    value: projectList.value.filter((p) => p.status === 'progress').length,
    icon: Clock,
  },
])

function statusClass(status: string) {
  const map: Record<string, string> = {
    complete: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  }
  return map[status] || ''
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

function projectImageCount(p: Project) {
  return p.images?.length ?? 0
}

function priorityClass(priority: number) {
  if (priority >= 80) return 'text-rose-600 dark:text-rose-400'
  if (priority >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-gray-500 dark:text-gray-400'
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

// ---- Project CRUD ----
const projectFormOpen = ref(false)
const editingProject = ref<Project | null>(null)
const selectedTechIds = ref<string[]>([])
const projectError = ref('')
const projectSubmitting = ref(false)

const projectInitialValues = computed(() => ({
  name: editingProject.value?.name ?? '',
  description: editingProject.value?.description ?? '',
  status: editingProject.value?.status ?? 'progress',
  teamType: editingProject.value?.teamType ?? 'solo',
  experience: editingProject.value?.experience ?? '',
  githubLink: editingProject.value?.githubLink ?? '',
  designLink: editingProject.value?.designLink ?? '',
  startDate: editingProject.value?.startDate ?? '',
  endDate: editingProject.value?.endDate ?? '',
  priority: editingProject.value?.priority ?? 50,
}))

const projectSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    description: z.string().min(1, 'Deskripsi wajib diisi'),
    status: z.enum(['complete', 'progress', 'paused']),
    teamType: z.enum(['solo', 'team']),
    experience: z.string().min(1, 'Pengalaman wajib diisi'),
    githubLink: z.string().url('URL tidak valid').optional().or(z.literal('')),
    designLink: z.string().url('URL tidak valid').optional().or(z.literal('')),
    startDate: z.string().optional().or(z.literal('')),
    endDate: z.string().optional().or(z.literal('')),
    priority: z.coerce.number().int().min(1, 'Min 1').max(100, 'Max 100').default(50),
  }),
)

function openProjectForm(project: Project | null) {
  editingProject.value = project
  selectedTechIds.value = project?.techs.map((t) => t.id) ?? []
  projectError.value = ''
  projectFormOpen.value = true
}

function closeProjectForm() {
  projectFormOpen.value = false
  editingProject.value = null
  selectedTechIds.value = []
  projectError.value = ''
}

function toggleTechId(id: string) {
  const idx = selectedTechIds.value.indexOf(id)
  if (idx === -1) {
    selectedTechIds.value.push(id)
  } else {
    selectedTechIds.value.splice(idx, 1)
  }
}

async function submitProject(values: any) {
  projectError.value = ''
  projectSubmitting.value = true
  try {
    const payload = {
      name: values.name,
      description: values.description,
      status: values.status,
      teamType: values.teamType,
      experience: values.experience,
      techIds: selectedTechIds.value,
      ownerId: authStore.user?.id || '',
      githubLink: values.githubLink || undefined,
      designLink: values.designLink || undefined,
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      priority: values.priority ?? 50,
    }
    if (editingProject.value) {
      await updateProjectMutate({ id: editingProject.value.id, data: payload })
    } else {
      await createProject(payload)
    }
    closeProjectForm()
  } catch (e: any) {
    projectError.value = e?.response?.data?.message || e?.message || 'Gagal menyimpan project'
  } finally {
    projectSubmitting.value = false
  }
}

async function confirmDeleteProject(id: string) {
  if (!confirm('Hapus project ini?')) return
  try {
    await deleteProjectMutate(id)
    alert('Project berhasil dihapus!')
  } catch (e: any) {
    alert(e?.response?.data?.message || e?.message || 'Gagal hapus project')
  }
}

// ---- Project Detail ----
const detailModalOpen = ref(false)
const detailProjectId = ref('')

function openProjectDetail(id: string) {
  detailProjectId.value = id
  detailModalOpen.value = true
}

// ---- Tech CRUD ----
const techFormOpen = ref(false)
const editingTech = ref<Tech | null>(null)
const techError = ref('')
const techSubmitting = ref(false)

const techSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    slug: z.string().min(1, 'Slug wajib diisi'),
    icon_url: z.string().optional().or(z.literal('')),
  }),
)

function openTechForm(tech: Tech | null) {
  editingTech.value = tech
  techError.value = ''
  techFormOpen.value = true
}

function closeTechForm() {
  techFormOpen.value = false
  editingTech.value = null
  techError.value = ''
}

async function submitTech(values: any) {
  techError.value = ''
  techSubmitting.value = true
  try {
    if (editingTech.value) {
      await updateTechMutate({ id: editingTech.value.id, data: values })
      alert('Tech berhasil diupdate!')
    } else {
      await createTechMutate(values)
      alert('Tech berhasil ditambahkan!')
    }
    closeTechForm()
  } catch (e: any) {
    techError.value = e?.response?.data?.message || e?.message || 'Gagal menyimpan tech'
  } finally {
    techSubmitting.value = false
  }
}

async function confirmDeleteTech(id: string) {
  if (!confirm('Hapus tech ini?')) return
  try {
    await deleteTechMutate(id)
    alert('Tech berhasil dihapus!')
  } catch (e: any) {
    alert(e?.response?.data?.message || e?.message || 'Gagal hapus tech')
  }
}
</script>

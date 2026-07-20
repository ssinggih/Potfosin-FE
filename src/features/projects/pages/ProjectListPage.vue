<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold">Projects</h1>
      <div class="flex gap-3">
        <div class="flex gap-2">
          <Button
            :variant="filter === 'all' ? 'primary' : 'outline'"
            size="sm"
            @click="filter = 'all'"
          >
            All
          </Button>
          <Button
            :variant="filter === 'complete' ? 'primary' : 'outline'"
            size="sm"
            @click="filter = 'complete'"
          >
            Complete
          </Button>
          <Button
            :variant="filter === 'progress' ? 'primary' : 'outline'"
            size="sm"
            @click="filter = 'progress'"
          >
            In Progress
          </Button>
        </div>
        <Button v-if="isAdmin" @click="router.push('/projects/create')">
          <Plus class="h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>

    <div v-if="isLoading" class="py-12 text-center text-gray-500">Loading...</div>

    <div v-else-if="!projects.length" class="py-12 text-center text-gray-500">
      No projects found
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @click="router.push(`/projects/${project.id}`)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@features/auth'
import { useProjects } from '../services/projectService'
import { Button } from '@components/ui'
import ProjectCard from '../components/ProjectCard.vue'
import { Plus } from 'lucide-vue-next'

const router = useRouter()
const { isAdmin } = useAuth()

const filter = ref<'all' | 'complete' | 'progress'>('all')

const queryParams = computed(() => ({
  status: filter.value === 'all' ? undefined : filter.value,
}))

const { data, isLoading } = useProjects(queryParams.value)

const projects = computed(() => data?.value?.data ?? [])
</script>

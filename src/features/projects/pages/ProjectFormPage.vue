<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="mb-8 text-2xl font-bold">
      {{ isEdit ? 'Edit Project' : 'New Project' }}
    </h1>

    <ProjectForm
      :project="projectData"
      :techs="techs"
      :is-loading="isSubmitting"
      @submit="handleSubmit"
      @cancel="router.back()"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProject, useCreateProject, useUpdateProject } from '../services/projectService'
import { useTechs } from '@features/techs'
import ProjectForm from '../components/ProjectForm.vue'

const route = useRoute()
const router = useRouter()

const projectId = route.params.id as string
const isEdit = !!projectId

const { data: projectData } = useProject(projectId)
const { data: techs } = useTechs()
const { mutateAsync: createProject, isPending: isCreating } = useCreateProject()
const { mutateAsync: updateProject, isPending: isUpdating } = useUpdateProject()

const isSubmitting = computed(() => isCreating.value || isUpdating.value)

async function handleSubmit(values: Parameters<typeof createProject>[0]) {
  if (isEdit) {
    await updateProject({ id: projectId, data: values })
  } else {
    await createProject(values)
  }
  router.push('/projects')
}
</script>

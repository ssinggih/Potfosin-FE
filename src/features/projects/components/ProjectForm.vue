<template>
  <Card>
    <VeeForm :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
      <div class="space-y-4">
        <FormField name="name" label="Project Name" placeholder="E-Commerce Platform" />
        <FormField
          name="description"
          label="Description"
          type="textarea"
          placeholder="Describe your project..."
        />

        <div class="grid gap-4 sm:grid-cols-2">
          <FormField
            name="githubLink"
            label="GitHub URL"
            type="url"
            placeholder="https://github.com/username/repo"
          />
          <FormField
            name="designLink"
            label="Design URL"
            type="url"
            placeholder="https://figma.com/file/..."
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Team Type</label>
            <Field
              name="teamType"
              as="select"
              class="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            >
              <option value="solo">Solo</option>
              <option value="team">Team</option>
            </Field>
            <ErrorMessage name="teamType" class="text-xs text-red-500" />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <Field
              name="status"
              as="select"
              class="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            >
              <option value="complete">Complete</option>
              <option value="progress">In Progress</option>
              <option value="paused">Paused</option>
            </Field>
            <ErrorMessage name="status" class="text-xs text-red-500" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Technologies</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tech in techs"
              :key="tech.id"
              type="button"
              :class="
                cn(
                  'rounded-full border px-3 py-1 text-sm transition-colors',
                  selectedTechIds.includes(tech.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600',
                )
              "
              @click="toggleTech(tech.id)"
            >
              {{ tech.name }}
            </button>
          </div>
        </div>

        <FormField
          name="experience"
          label="Experience"
          type="textarea"
          placeholder="What did you learn from this project?"
        />

        <div class="flex justify-end gap-3 pt-4">
          <Button variant="outline" @click="$emit('cancel')"> Cancel </Button>
          <Button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Saving...' : project ? 'Update Project' : 'Create Project' }}
          </Button>
        </div>
      </div>
    </VeeForm>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { Tech } from '@/api/techs.api'
import type { Project } from '@/api/projects.api'
import { Card } from '@components/cards'
import { Button } from '@components/ui'
import FormField from '@components/form/FormField.vue'
import { cn } from '@/utils/cn'

interface Props {
  project?: Project | null
  techs?: Tech[]
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  project: null,
  techs: () => [],
  isLoading: false,
})

const emit = defineEmits<{
  submit: [values: any]
  cancel: []
}>()

const selectedTechIds = ref<string[]>(props.project?.techs?.map((t) => t.id) ?? [])

const schema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name wajib diisi'),
    description: z.string().min(1, 'Description wajib diisi'),
    teamType: z.enum(['solo', 'team']),
    githubLink: z.string().url('URL tidak valid').optional().or(z.literal('')),
    designLink: z.string().url('URL tidak valid').optional().or(z.literal('')),
    status: z.enum(['complete', 'progress', 'paused']),
    experience: z.string().min(1, 'Experience wajib diisi'),
  }),
)

const initialValues = {
  name: props.project?.name ?? '',
  description: props.project?.description ?? '',
  teamType: props.project?.teamType ?? 'solo',
  githubLink: props.project?.githubLink ?? '',
  designLink: props.project?.designLink ?? '',
  status: props.project?.status ?? 'progress',
  experience: props.project?.experience ?? '',
}

function toggleTech(id: string) {
  const idx = selectedTechIds.value.indexOf(id)
  if (idx >= 0) {
    selectedTechIds.value.splice(idx, 1)
  } else {
    selectedTechIds.value.push(id)
  }
}

function onSubmit(values: any) {
  emit('submit', { ...values, techIds: selectedTechIds.value })
}
</script>

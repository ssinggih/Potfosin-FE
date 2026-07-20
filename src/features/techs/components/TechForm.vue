<template>
  <VeeForm :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-4">
      <FormField name="name" label="Name" placeholder="React" />
      <FormField name="slug" label="Slug" placeholder="react" />
      <FormField
        name="icon_url"
        label="Icon URL"
        type="url"
        placeholder="https://cdn.example.com/icon.svg"
      />

      <div class="flex justify-end gap-3 pt-4">
        <Button variant="outline" @click="$emit('cancel')"> Cancel </Button>
        <Button type="submit">
          {{ tech ? 'Update' : 'Create' }}
        </Button>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { Tech } from '@/api/techs.api'
import { Button } from '@components/ui'
import FormField from '@components/form/FormField.vue'

interface Props {
  tech?: Tech | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [{ name: string; slug: string; icon_url: string }]
  cancel: []
}>()

const schema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name wajib diisi'),
    slug: z.string().min(1, 'Slug wajib diisi'),
    icon_url: z.string().url('URL tidak valid'),
  }),
)

const initialValues = {
  name: props.tech?.name ?? '',
  slug: props.tech?.slug ?? '',
  icon_url: props.tech?.icon_url ?? '',
}

function onSubmit(values: any) {
  emit('submit', values)
}
</script>

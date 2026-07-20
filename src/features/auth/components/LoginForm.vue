<template>
  <form
    class="space-y-4 rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
  >
    <VeeForm :validation-schema="loginSchema" @submit="onSubmit">
      <div class="space-y-4">
        <FormField
          name="email"
          :label="$t('auth.email')"
          type="email"
          placeholder="email@example.com"
          autocomplete="email"
        />
        <FormField
          name="password"
          :label="$t('auth.password')"
          type="password"
          autocomplete="current-password"
        />
      </div>

      <Button type="submit" class="mt-6 w-full" :disabled="isPending">
        {{ isPending ? $t('common.loading') : $t('auth.login') }}
      </Button>
    </VeeForm>
  </form>
</template>

<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import Button from '@components/ui/Button.vue'
import FormField from '@components/form/FormField.vue'

const emit = defineEmits<{ success: [] }>()

const { handleLogin } = useAuth()

const isPending = ref(false)

const loginSchema = toTypedSchema(
  z.object({
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    password: z.string().min(1, 'Password wajib diisi'),
  }),
)

async function onSubmit(values: any) {
  isPending.value = true
  await handleLogin(values.email, values.password)
  isPending.value = false
  emit('success')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="handleClose" />
      <div
        class="relative z-10 w-full max-w-md rounded-xl border bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900"
      >
        <button
          class="absolute top-4 right-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          @click="handleClose"
        >
          <X class="h-5 w-5" />
        </button>

        <h2 class="mb-1 text-2xl font-bold">
          {{ $t('auth.login') }}
        </h2>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {{ $t('auth.loginDesc') }}
        </p>

        <VeeForm :validation-schema="schema" @submit="onSubmit">
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

          <p
            v-if="error"
            class="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400"
          >
            {{ error }}
          </p>

          <Button type="submit" class="mt-6 w-full" :disabled="submitting">
            {{ submitting ? $t('common.loading') : $t('auth.login') }}
          </Button>
        </VeeForm>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Form as VeeForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useAuthStore } from '../stores/authStore'
import Button from '@components/ui/Button.vue'
import FormField from '@components/form/FormField.vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; success: [] }>()

const authStore = useAuthStore()
const error = ref('')
const submitting = ref(false)

const schema = toTypedSchema(
  z.object({
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    password: z.string().min(1, 'Password wajib diisi'),
  }),
)

watch(
  () => props.open,
  (val) => {
    if (val) {
      error.value = ''
    }
  },
)

function handleClose() {
  emit('close')
}

async function onSubmit(values: any) {
  error.value = ''
  submitting.value = true
  try {
    await authStore.login(values.email, values.password)
    emit('success')
  } catch (e: any) {
    if (e?.response?.data?.message) {
      error.value = e.response.data.message
    } else if (e?.message) {
      error.value = e.message
    } else {
      error.value = 'Terjadi kesalahan. Periksa koneksi Anda.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

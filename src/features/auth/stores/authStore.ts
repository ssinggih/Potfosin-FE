import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'
import { authApi } from '@/api/auth.api'
import { STORAGE_KEYS } from '@/constants'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  const isOwner = computed(() => user.value?.role === 'owner')
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'owner')

  async function login(email: string, password: string): Promise<void> {
    isLoading.value = true
    try {
      const { data } = await authApi.login({ email, password })
      const { accessToken, user: userData } = data
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      user.value = userData
      isAuthenticated.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProfile(): Promise<void> {
    try {
      const { data } = await authApi.profile()
      user.value = data
      isAuthenticated.value = true
    } catch {
      user.value = null
      isAuthenticated.value = false
    }
  }

  function logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    user.value = null
    isAuthenticated.value = false
    window.location.href = '/'
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    isOwner,
    isAdmin,
    login,
    fetchProfile,
    logout,
  }
})

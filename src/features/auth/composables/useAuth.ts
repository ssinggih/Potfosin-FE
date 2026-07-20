import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()
  const { user, isAuthenticated, isLoading, isOwner, isAdmin } = storeToRefs(store)

  async function handleLogin(email: string, password: string): Promise<void> {
    await store.login(email, password)
    await router.push('/')
  }

  function handleLogout(): void {
    store.logout()
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    isOwner,
    isAdmin,
    handleLogin,
    handleLogout,
    fetchProfile: store.fetchProfile,
  }
}

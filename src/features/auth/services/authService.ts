import { useQuery, useMutation } from '@tanstack/vue-query'
import { authApi } from '@/api/auth.api'
import type { LoginRequest } from '../types'

export function useProfile() {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const { data } = await authApi.profile()
      return data
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
  })
}

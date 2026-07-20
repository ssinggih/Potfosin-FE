import { apiClient } from './client'
import type { User } from '@features/auth/types'

export const usersApi = {
  getAll: () => apiClient.get<User[]>('/users'),

  getById: (id: string) => apiClient.get<User>(`/users/${id}`),

  create: (data: { email: string; name: string; password: string; role: string }) =>
    apiClient.post<User>('/users', data),

  update: (id: string, data: Partial<User>) => apiClient.put<User>(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete(`/users/${id}`),
}

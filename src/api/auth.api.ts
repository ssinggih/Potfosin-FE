import { apiClient } from './client'
import type { LoginRequest, AuthResponse, User } from '@features/auth/types'

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<AuthResponse>('/auth/login', data),

  logout: () => apiClient.post('/auth/logout'),

  profile: () => apiClient.get<User>('/auth/profile'),
}

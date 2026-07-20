export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface User {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'user'
  avatar?: string
  created_at: string
  updated_at: string
}

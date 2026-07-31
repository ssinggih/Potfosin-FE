import { apiClient } from './client'
import type { QueryParams } from '@/types/api'

export interface Project {
  id: string
  name: string
  description: string
  teamType: 'solo' | 'team'
  githubLink?: string
  designLink?: string
  demoLink?: string
  demoUrl?: string
  role?: string
  keyFeatures?: string[]
  results?: string
  challenges?: string
  status: 'complete' | 'progress' | 'paused'
  experience: string
  startDate?: string | null
  endDate?: string | null
  priority: number
  ownerId?: string
  owner?: {
    id: string
    name: string
    email: string
    role: string
  } | null
  techs: Array<{
    id: string
    name: string
    slug: string
    icon_url: string
  }>
  images?: Array<{
    id: string
    url: string
    type: 'mockup' | 'post'
  }>
  createdAt: string
  updatedAt: string
}

export type CreateProjectPayload = {
  name: string
  description: string
  teamType: 'solo' | 'team'
  githubLink?: string
  designLink?: string
  demoUrl?: string
  role?: string
  keyFeatures?: string[]
  results?: string
  challenges?: string
  status: 'complete' | 'progress' | 'paused'
  experience: string
  techIds: string[]
  ownerId: string
  startDate?: string | null
  endDate?: string | null
  priority?: number
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>

export const projectsApi = {
  getAll: (params?: QueryParams) =>
    apiClient.get<{
      data: Project[]
      meta: { page: number; limit: number; total: number; totalPages: number }
    }>('/projects', { params }),

  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),

  create: (data: CreateProjectPayload) => apiClient.post<Project>('/projects', data),

  update: (id: string, data: UpdateProjectPayload) =>
    apiClient.put<Project>(`/projects/${id}`, data),

  partialUpdate: (id: string, data: UpdateProjectPayload) =>
    apiClient.patch<Project>(`/projects/${id}`, data),

  delete: (id: string) => apiClient.delete(`/projects/${id}`),
}

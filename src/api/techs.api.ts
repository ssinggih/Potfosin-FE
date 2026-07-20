import { apiClient } from './client'

export interface Tech {
  id: string
  name: string
  slug: string
  icon_url: string
  created_at: string
  updated_at: string
}

export type CreateTechPayload = Pick<Tech, 'name' | 'slug' | 'icon_url'>
export type UpdateTechPayload = Partial<CreateTechPayload>

function toApiPayload(data: CreateTechPayload | UpdateTechPayload) {
  const p: Record<string, string> = {}
  if (data.name) p.name = data.name
  if (data.slug) p.slug = data.slug
  if (data.icon_url !== undefined) p.iconUrl = data.icon_url
  return p as any
}

export const techsApi = {
  getAll: () => apiClient.get<{ data: Tech[]; total: number }>('/techs'),

  getById: (id: string) => apiClient.get<Tech>(`/techs/${id}`),

  create: (data: CreateTechPayload) => apiClient.post<Tech>('/techs', toApiPayload(data)),

  update: (id: string, data: UpdateTechPayload) =>
    apiClient.put<Tech>(`/techs/${id}`, toApiPayload(data)),

  delete: (id: string) => apiClient.delete(`/techs/${id}`),
}

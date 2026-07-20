import { apiClient } from './client'

export interface Image {
  id: string
  url: string
  type: 'mockup' | 'post'
  projectId?: string
  createdAt?: string
}

function extractFromResponse(data: unknown): Image[] {
  if (Array.isArray(data)) return data as Image[]
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if ('images' in obj && Array.isArray(obj.images)) return obj.images as Image[]
    if ('data' in obj && Array.isArray(obj.data)) return obj.data as Image[]
  }
  return []
}

export const uploadsApi = {
  uploadMockup: (projectId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post<Image>(`/uploads/${projectId}/mockup`, formData)
  },

  uploadPost: (projectId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post<Image>(`/uploads/${projectId}/post`, formData)
  },

  getProjectImages: async (projectId: string) => {
    const res = await apiClient.get<unknown>(`/uploads/${projectId}`)
    return { data: extractFromResponse(res.data) }
  },

  delete: (imageId: string) => apiClient.delete(`/uploads/${imageId}`),
}

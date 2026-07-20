export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  status?: string
  techId?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}

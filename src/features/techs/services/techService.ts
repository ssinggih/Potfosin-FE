import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { techsApi } from '@/api/techs.api'
import type { CreateTechPayload, UpdateTechPayload } from '@/api/techs.api'

export function useTechs() {
  return useQuery({
    queryKey: ['techs'],
    queryFn: async () => {
      const { data } = await techsApi.getAll()
      return data.data
    },
  })
}

export function useTech(id: string) {
  return useQuery({
    queryKey: ['techs', id],
    queryFn: async () => {
      const { data } = await techsApi.getById(id)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateTech() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTechPayload) => techsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['techs'] }),
  })
}

export function useUpdateTech() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTechPayload }) =>
      techsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['techs'] }),
  })
}

export function useDeleteTech() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => techsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['techs'] }),
  })
}

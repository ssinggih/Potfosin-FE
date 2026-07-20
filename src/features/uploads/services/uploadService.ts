import { type MaybeRef, type Ref, computed, unref } from 'vue'
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/vue-query'
import { uploadsApi } from '@/api/uploads.api'
import type { Image } from '@/api/uploads.api'

export function useProjectImages(projectId: MaybeRef<string>) {
  return useQuery({
    queryKey: ['project-images', projectId],
    queryFn: async ({ queryKey }) => {
      const id = queryKey[1]
      const { data } = await uploadsApi.getProjectImages(id as string)
      return data as Image[]
    },
    enabled: computed(() => !!unref(projectId)),
  })
}

export function useAllProjectImages(projectIds: Ref<string[]>) {
  const queries = computed(() =>
    projectIds.value.map((id) => ({
      queryKey: ['project-images', id] as const,
      queryFn: async () => {
        const { data } = await uploadsApi.getProjectImages(id)
        return { projectId: id, images: data as Image[] }
      },
      enabled: !!id,
    })),
  )

  const results = useQueries({ queries })

  const allImages = computed(() => {
    const list: Array<{ projectId: string; images: Image[] }> = []
    for (const r of results.value) {
      if (r.data) list.push(r.data)
    }
    return list
  })

  const isLoading = computed(() => results.value.some((r) => r.isLoading))

  return { data: allImages, isLoading }
}

export function useUploadMockup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
      uploadsApi.uploadMockup(projectId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-images', variables.projectId] })
    },
  })
}

export function useUploadPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
      uploadsApi.uploadPost(projectId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-images', variables.projectId] })
    },
  })
}

export function useDeleteImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (imageId: string) => uploadsApi.delete(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-images'] })
    },
  })
}

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadsApi } from '@/api/uploads.api'

vi.mock('@/api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}))

const { apiClient } = await import('@/api/client')

describe('uploadsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('uploadMockup', () => {
    it('sends FormData to correct endpoint (no explicit Content-Type)', async () => {
      const file = new File([''], 'mockup.png', { type: 'image/png' })
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { id: '1', url: 'https://cdn.com/img.png', type: 'mockup' },
      })

      await uploadsApi.uploadMockup('project-123', file)

      expect(apiClient.post).toHaveBeenCalledWith(
        '/uploads/project-123/mockup',
        expect.any(FormData),
      )

      const formData = vi.mocked(apiClient.post).mock.calls[0]![1] as FormData
      expect(formData.get('file')).toBe(file)
    })

    it('returns the uploaded image data', async () => {
      const file = new File([''], 'img.png', { type: 'image/png' })
      const response = { id: 'img-1', url: 'https://cdn.com/img.png', type: 'mockup' }
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: response })

      const result = await uploadsApi.uploadMockup('pid', file)

      expect(result.data).toEqual(response)
    })
  })

  describe('uploadPost', () => {
    it('sends FormData to /uploads/:projectId/post (no explicit Content-Type)', async () => {
      const file = new File([''], 'post.png', { type: 'image/png' })
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { id: '1', url: '', type: 'post' } })

      await uploadsApi.uploadPost('project-123', file)

      expect(apiClient.post).toHaveBeenCalledWith('/uploads/project-123/post', expect.any(FormData))
    })
  })

  describe('getProjectImages', () => {
    it('fetches images for a project', async () => {
      const images = [
        { id: '1', url: 'https://cdn.com/1.png', type: 'mockup' as const },
        { id: '2', url: 'https://cdn.com/2.png', type: 'post' as const },
      ]
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: images })

      const result = await uploadsApi.getProjectImages('project-123')

      expect(apiClient.get).toHaveBeenCalledWith('/uploads/project-123')
      expect(result.data).toHaveLength(2)
    })
  })

  describe('delete', () => {
    it('deletes an image by id', async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({ data: {} })

      await uploadsApi.delete('image-456')

      expect(apiClient.delete).toHaveBeenCalledWith('/uploads/image-456')
    })
  })
})

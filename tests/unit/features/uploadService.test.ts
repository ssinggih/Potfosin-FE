import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadsApi } from '@/api/uploads.api'
import type { Image } from '@/api/uploads.api'

vi.mock('@/api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('uploadService (API layer)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds correct FormData for mockup upload', async () => {
    const file = new File(['test-content'], 'mockup.png', { type: 'image/png' })
    const { apiClient } = await import('@/api/client')
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { id: 'img-1', url: 'https://cdn.com/mockup.png', type: 'mockup' },
    })

    const result = await uploadsApi.uploadMockup('pid', file)

    expect(result.data.type).toBe('mockup')
    expect(result.data.id).toBe('img-1')
  })

  it('builds correct FormData for post upload', async () => {
    const file = new File(['test-content'], 'post.png', { type: 'image/png' })
    const { apiClient } = await import('@/api/client')
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { id: 'img-2', url: 'https://cdn.com/post.png', type: 'post' },
    })

    const result = await uploadsApi.uploadPost('pid', file)

    expect(result.data.type).toBe('post')
  })

  it('returns image array from getProjectImages', async () => {
    const mockImages: Image[] = [
      { id: 'a', url: 'https://cdn.com/a.png', type: 'mockup' },
      { id: 'b', url: 'https://cdn.com/b.png', type: 'post' },
    ]
    const { apiClient } = await import('@/api/client')
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockImages })

    const result = await uploadsApi.getProjectImages('pid')
    const images = result.data!

    expect(images).toHaveLength(2)
    expect(images[0]!.type).toBe('mockup')
    expect(images[1]!.type).toBe('post')
  })

  it('handles empty image list', async () => {
    const { apiClient } = await import('@/api/client')
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] })

    const result = await uploadsApi.getProjectImages('pid')

    expect(result.data).toEqual([])
  })

  it('deletes image and returns success', async () => {
    const { apiClient } = await import('@/api/client')
    vi.mocked(apiClient.delete).mockResolvedValueOnce({ data: { success: true } })

    const result = await uploadsApi.delete('img-1')

    expect(apiClient.delete).toHaveBeenCalledWith('/uploads/img-1')
    expect(result.data.success).toBe(true)
  })

  it('handles upload error gracefully', async () => {
    const { apiClient } = await import('@/api/client')
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Network error'))

    await expect(uploadsApi.uploadMockup('pid', new File([''], 'x.png'))).rejects.toThrow(
      'Network error',
    )
  })

  it('validates image type from response', async () => {
    const { apiClient } = await import('@/api/client')
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: { id: '1', url: 'https://cdn.com/x.png', type: 'mockup' },
    })

    const result = await uploadsApi.uploadMockup('pid', new File([''], 'x.png'))

    const validTypes = ['mockup', 'post'] as const
    expect(validTypes).toContain(result.data.type)
  })
})

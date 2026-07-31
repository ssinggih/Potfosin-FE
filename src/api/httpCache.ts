import type { AxiosRequestConfig, AxiosResponse } from 'axios'

interface CacheEntry {
  etag?: string
  data: unknown
  maxAge: number
  timestamp: number
  cacheControl?: string
}

interface StorageEntry {
  etag?: string
  data: unknown
  maxAge: number
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
const STORAGE_KEY = 'http_etag_cache'
const MAX_STORAGE_ENTRIES = 50
const ETAG_CACHE_TTL = 3600

function getCacheKey(config: AxiosRequestConfig): string {
  const params = config.params
    ? JSON.stringify(config.params, Object.keys(config.params).sort())
    : ''
  return `${config.method ?? 'get'}:${config.url ?? ''}:${params}`
}

function parseCacheControl(header?: string): {
  maxAge: number
  noCache: boolean
  noStore: boolean
} {
  const result = { maxAge: 0, noCache: false, noStore: false }
  if (!header) return result

  const directives = header.split(',').map((d) => d.trim().toLowerCase())

  for (const d of directives) {
    if (d === 'no-cache') result.noCache = true
    if (d === 'no-store') result.noStore = true
    if (d.startsWith('max-age=')) {
      const val = parseInt(d.split('=')[1] ?? '', 10)
      if (!isNaN(val)) result.maxAge = val
    }
  }

  return result
}

function isExpired(entry: CacheEntry): boolean {
  if (entry.etag) return false
  return Date.now() - entry.timestamp > entry.maxAge * 1000
}

function loadFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const stored: Record<string, StorageEntry> = JSON.parse(raw)
    for (const [key, value] of Object.entries(stored)) {
      if (value.etag || !isExpired({ ...value, maxAge: value.maxAge })) {
        cache.set(key, { ...value, cacheControl: undefined })
      }
    }
  } catch {
    // ignore corrupted storage
  }
}

function persistToStorage(): void {
  try {
    const entries: Record<string, StorageEntry> = {}
    let count = 0

    for (const [key, value] of cache.entries()) {
      if (count >= MAX_STORAGE_ENTRIES) break
      if (value.etag || (!isExpired(value) && value.maxAge > 0)) {
        entries[key] = {
          etag: value.etag,
          data: value.data,
          maxAge: value.maxAge,
          timestamp: value.timestamp,
        }
        count++
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // storage full or unavailable
  }
}

function getCachedResponse(config: AxiosRequestConfig): CacheEntry | null {
  if (config.method && config.method.toLowerCase() !== 'get') return null

  const key = getCacheKey(config)
  const entry = cache.get(key)
  if (!entry) return null

  if (!entry.etag && isExpired(entry)) {
    cache.delete(key)
    return null
  }

  return entry
}

function setCachedResponse(config: AxiosRequestConfig, response: AxiosResponse): void {
  if (config.method && config.method.toLowerCase() !== 'get') return

  const etag = response.headers['etag'] as string | undefined
  const cacheControl = response.headers['cache-control'] as string | undefined
  const parsed = parseCacheControl(cacheControl)

  if (parsed.noStore) return

  const key = getCacheKey(config)
  const maxAge = parsed.maxAge > 0 ? parsed.maxAge : etag ? ETAG_CACHE_TTL : 0

  if (maxAge <= 0 && !etag) return

  cache.set(key, {
    etag,
    data: response.data,
    maxAge,
    timestamp: Date.now(),
    cacheControl,
  })

  persistToStorage()
}

function getConditionalHeaders(config: AxiosRequestConfig): Record<string, string> | null {
  if (config.method && config.method.toLowerCase() !== 'get') return null

  const key = getCacheKey(config)
  const entry = cache.get(key)
  if (!entry?.etag) return null

  return { 'If-None-Match': entry.etag }
}

function evict(pattern?: string): void {
  if (!pattern) {
    cache.clear()
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key)
    }
  }
  persistToStorage()
}

loadFromStorage()

export const httpCache = {
  getCachedResponse,
  setCachedResponse,
  getConditionalHeaders,
  getCacheKey,
  parseCacheControl,
  evict,
}

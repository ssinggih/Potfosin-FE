import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'
import { httpCache } from './httpCache'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://portfosin.vercel.app/api/v1'

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const conditionalHeaders = httpCache.getConditionalHeaders(config)
    if (conditionalHeaders) {
      config.headers['If-None-Match'] = conditionalHeaders['If-None-Match']
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => {
    if (response.status === 304) {
      const cacheEntry = httpCache.getCachedResponse(response.config)
      if (cacheEntry) {
        response.data = cacheEntry.data
        return response
      }
    }

    if (response.status === 200) {
      httpCache.setCachedResponse(response.config, response)
    }

    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (response.data.success === true) {
        response.data = response.data.data
      }
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 304) {
      const cacheEntry = httpCache.getCachedResponse(error.config!)
      if (cacheEntry) {
        return Promise.resolve({
          data: cacheEntry.data,
          status: 304,
          statusText: 'Not Modified',
          headers: error.response.headers,
          config: error.config!,
        })
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
    }
    return Promise.reject(error)
  },
)

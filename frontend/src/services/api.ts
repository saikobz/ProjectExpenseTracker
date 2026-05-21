import axios from 'axios'
import { getToken, removeToken } from '@/lib/token'

const baseURL = import.meta.env.VITE_API_URL ?? ''

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url as string | undefined
    const isAuthAttempt =
      url?.includes('/api/auth/login') || url?.includes('/api/auth/register')

    if (status === 401 && !isAuthAttempt) {
      removeToken()
      unauthorizedHandler?.()
    }
    return Promise.reject(error)
  },
)

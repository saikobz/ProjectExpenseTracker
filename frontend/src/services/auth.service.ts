import { getApiErrorMessage } from '@/lib/api-error'
import { api } from '@/services/api'
import type { AuthSuccessResponse, AuthUser, MeSuccessResponse } from '@/types/auth'

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthSuccessResponse['data']> {
  const { data } = await api.post<AuthSuccessResponse>('/api/auth/register', {
    name,
    email,
    password,
  })
  return data.data
}

export async function login(
  email: string,
  password: string,
): Promise<AuthSuccessResponse['data']> {
  const { data } = await api.post<AuthSuccessResponse>('/api/auth/login', {
    email,
    password,
  })
  return data.data
}

export async function fetchMe(): Promise<AuthUser> {
  const { data } = await api.get<MeSuccessResponse>('/api/auth/me')
  return data.data.user
}

export async function logoutApi(): Promise<void> {
  await api.post('/api/auth/logout')
}

export function getErrorMessage(error: unknown): string {
  return getApiErrorMessage(error)
}

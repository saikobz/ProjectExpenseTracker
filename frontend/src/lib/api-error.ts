import type { ApiErrorResponse } from '@/types/auth'

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: ApiErrorResponse } }).response?.data?.message ===
      'string'
  ) {
    return (error as { response: { data: ApiErrorResponse } }).response.data.message
  }

  return fallback
}

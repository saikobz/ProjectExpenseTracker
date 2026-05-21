import { api } from '@/services/api'
import type {
  CategoriesListResponse,
  Category,
  CategoryResponse,
  CategoryType,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/category'
import type { ApiErrorResponse } from '@/types/auth'

export async function getCategories(type?: CategoryType): Promise<Category[]> {
  const { data } = await api.get<CategoriesListResponse>('/api/categories', {
    params: type ? { type } : undefined,
  })
  return data.data.categories
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const { data } = await api.post<CategoryResponse>('/api/categories', input)
  return data.data.category
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<Category> {
  const { data } = await api.patch<CategoryResponse>(`/api/categories/${id}`, input)
  return data.data.category
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/api/categories/${id}`)
}

export function getCategoryErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: ApiErrorResponse } }).response?.data?.message ===
      'string'
  ) {
    return (error as { response: { data: ApiErrorResponse } }).response.data.message
  }

  return 'Something went wrong. Please try again.'
}

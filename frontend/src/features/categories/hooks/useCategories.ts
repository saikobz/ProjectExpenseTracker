import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as categoryService from '@/services/category.service'
import type { CategoryType, CreateCategoryInput, UpdateCategoryInput } from '@/types/category'

export const categoryKeys = {
  all: ['categories'] as const,
  list: (type?: CategoryType) => [...categoryKeys.all, type ?? 'all'] as const,
}

export function useCategories(type?: CategoryType) {
  return useQuery({
    queryKey: categoryKeys.list(type),
    queryFn: () => categoryService.getCategories(type),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryService.createCategory(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      categoryService.updateCategory(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

export type CategoryType = 'income' | 'expense'

export type Category = {
  id: string
  name: string
  type: CategoryType
  color: string | null
  createdAt: string
  updatedAt: string
}

export type CategoriesListResponse = {
  success: true
  message: string
  data: { categories: Category[] }
}

export type CategoryResponse = {
  success: true
  message: string
  data: { category: Category }
}

export type CreateCategoryInput = {
  name: string
  type: CategoryType
  color?: string | null
}

export type UpdateCategoryInput = {
  name?: string
  color?: string | null
}

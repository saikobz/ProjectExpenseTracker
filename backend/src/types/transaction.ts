import type { CategoryType } from '@prisma/client'

export type TransactionCategoryDto = {
  id: string
  name: string
  type: CategoryType
  color: string | null
}

export type TransactionDto = {
  id: string
  type: CategoryType
  categoryId: string
  amount: number
  description: string | null
  transactionDate: string
  paymentMethod: string | null
  category: TransactionCategoryDto
  createdAt: string
  updatedAt: string
}

export type PaginatedTransactionsDto = {
  items: TransactionDto[]
  page: number
  limit: number
  total: number
  totalPages: number
}

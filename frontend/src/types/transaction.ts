import type { CategoryType } from '@/types/category'

export type { CategoryType }

export type TransactionCategory = {
  id: string
  name: string
  type: CategoryType
  color: string | null
}

export type Transaction = {
  id: string
  type: CategoryType
  categoryId: string
  amount: number
  description: string | null
  transactionDate: string
  paymentMethod: string | null
  category: TransactionCategory
  createdAt: string
  updatedAt: string
}

export type TransactionListParams = {
  type?: CategoryType
  categoryId?: string
  from?: string
  to?: string
  search?: string
  sortBy?: 'date' | 'amount'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export type PaginatedTransactions = {
  items: Transaction[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export type TransactionListResponse = {
  success: true
  message: string
  data: PaginatedTransactions
}

export type TransactionResponse = {
  success: true
  message: string
  data: { transaction: Transaction }
}

export type CreateTransactionInput = {
  type: CategoryType
  categoryId: string
  amount: number
  description?: string | null
  transactionDate: string
  paymentMethod?: string | null
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>

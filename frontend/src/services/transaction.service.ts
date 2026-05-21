import { api } from '@/services/api'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  CreateTransactionInput,
  PaginatedTransactions,
  Transaction,
  TransactionListParams,
  TransactionListResponse,
  TransactionResponse,
  UpdateTransactionInput,
} from '@/types/transaction'

export async function getTransactions(
  params: TransactionListParams,
): Promise<PaginatedTransactions> {
  const { data } = await api.get<TransactionListResponse>('/api/transactions', { params })
  return data.data
}

export async function getTransactionById(id: string): Promise<Transaction> {
  const { data } = await api.get<TransactionResponse>(`/api/transactions/${id}`)
  return data.data.transaction
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const { data } = await api.post<TransactionResponse>('/api/transactions', input)
  return data.data.transaction
}

export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput,
): Promise<Transaction> {
  const { data } = await api.patch<TransactionResponse>(`/api/transactions/${id}`, input)
  return data.data.transaction
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/api/transactions/${id}`)
}

export function getTransactionErrorMessage(error: unknown): string {
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

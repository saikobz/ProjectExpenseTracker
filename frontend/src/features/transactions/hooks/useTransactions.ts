import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as transactionService from '@/services/transaction.service'
import type {
  CreateTransactionInput,
  TransactionListParams,
  UpdateTransactionInput,
} from '@/types/transaction'

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (params: TransactionListParams) => [...transactionKeys.all, 'list', params] as const,
  detail: (id: string) => [...transactionKeys.all, 'detail', id] as const,
}

export function useTransactions(params: TransactionListParams) {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => transactionService.getTransactions(params),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTransactionInput) => transactionService.createTransaction(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTransactionInput }) =>
      transactionService.updateTransaction(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

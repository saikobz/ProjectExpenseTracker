import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as budgetService from '@/services/budget.service'
import type { BudgetPeriod, CreateBudgetInput, UpdateBudgetInput } from '@/types/budget'

export const budgetKeys = {
  all: ['budgets'] as const,
  list: (period: BudgetPeriod) => [...budgetKeys.all, 'list', period] as const,
}

export function useBudgets(period: BudgetPeriod) {
  return useQuery({
    queryKey: budgetKeys.list(period),
    queryFn: () => budgetService.getBudgets(period),
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBudgetInput) => budgetService.createBudget(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: budgetKeys.all })
    },
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBudgetInput }) =>
      budgetService.updateBudget(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: budgetKeys.all })
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => budgetService.deleteBudget(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: budgetKeys.all })
    },
  })
}

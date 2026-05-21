import { getApiErrorMessage } from '@/lib/api-error'
import { api } from '@/services/api'
import type {
  Budget,
  BudgetPeriod,
  BudgetWithUsage,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '@/types/budget'

type BudgetListResponse = {
  success: true
  data: { budgets: BudgetWithUsage[] }
}

type BudgetResponse = {
  success: true
  data: { budget: Budget }
}

export async function getBudgets(period: BudgetPeriod): Promise<BudgetWithUsage[]> {
  const { data } = await api.get<BudgetListResponse>('/api/budgets', { params: period })
  return data.data.budgets
}

export async function createBudget(input: CreateBudgetInput): Promise<Budget> {
  const { data } = await api.post<BudgetResponse>('/api/budgets', input)
  return data.data.budget
}

export async function updateBudget(id: string, input: UpdateBudgetInput): Promise<Budget> {
  const { data } = await api.patch<BudgetResponse>(`/api/budgets/${id}`, input)
  return data.data.budget
}

export async function deleteBudget(id: string): Promise<void> {
  await api.delete(`/api/budgets/${id}`)
}

export function getBudgetErrorMessage(error: unknown): string {
  return getApiErrorMessage(error)
}

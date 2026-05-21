import { getApiErrorMessage } from '@/lib/api-error'
import { api } from '@/services/api'
import type {
  CategoryExpenseItem,
  DashboardPeriod,
  DashboardSummary,
  MonthlyTrendItem,
  RecentTransactionItem,
} from '@/types/dashboard'

type SummaryResponse = {
  success: true
  data: { summary: DashboardSummary }
}

type CategoryExpensesResponse = {
  success: true
  data: { categoryExpenses: CategoryExpenseItem[] }
}

type MonthlyTrendResponse = {
  success: true
  data: { monthlyTrend: MonthlyTrendItem[] }
}

type RecentTransactionsResponse = {
  success: true
  data: { recentTransactions: RecentTransactionItem[] }
}

export async function getDashboardSummary(period: DashboardPeriod): Promise<DashboardSummary> {
  const { data } = await api.get<SummaryResponse>('/api/dashboard/summary', {
    params: period,
  })
  return data.data.summary
}

export async function getCategoryExpenses(
  period: DashboardPeriod,
): Promise<CategoryExpenseItem[]> {
  const { data } = await api.get<CategoryExpensesResponse>('/api/dashboard/category-expenses', {
    params: period,
  })
  return data.data.categoryExpenses
}

export async function getMonthlyTrend(year: number): Promise<MonthlyTrendItem[]> {
  const { data } = await api.get<MonthlyTrendResponse>('/api/dashboard/monthly-trend', {
    params: { year },
  })
  return data.data.monthlyTrend
}

export async function getRecentTransactions(limit = 5): Promise<RecentTransactionItem[]> {
  const { data } = await api.get<RecentTransactionsResponse>(
    '/api/dashboard/recent-transactions',
    { params: { limit } },
  )
  return data.data.recentTransactions
}

export function getDashboardErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, 'Failed to load dashboard data.')
}

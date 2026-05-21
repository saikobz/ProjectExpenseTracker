import { useQueries } from '@tanstack/react-query'
import * as dashboardService from '@/services/dashboard.service'
import type { DashboardPeriod } from '@/types/dashboard'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: (period: DashboardPeriod) => [...dashboardKeys.all, 'summary', period] as const,
  categoryExpenses: (period: DashboardPeriod) =>
    [...dashboardKeys.all, 'category-expenses', period] as const,
  monthlyTrend: (year: number) => [...dashboardKeys.all, 'monthly-trend', year] as const,
  recent: (limit: number) => [...dashboardKeys.all, 'recent', limit] as const,
}

export function useDashboardData(period: DashboardPeriod, recentLimit = 5) {
  return useQueries({
    queries: [
      {
        queryKey: dashboardKeys.summary(period),
        queryFn: () => dashboardService.getDashboardSummary(period),
      },
      {
        queryKey: dashboardKeys.categoryExpenses(period),
        queryFn: () => dashboardService.getCategoryExpenses(period),
      },
      {
        queryKey: dashboardKeys.monthlyTrend(period.year),
        queryFn: () => dashboardService.getMonthlyTrend(period.year),
      },
      {
        queryKey: dashboardKeys.recent(recentLimit),
        queryFn: () => dashboardService.getRecentTransactions(recentLimit),
      },
    ],
  })
}

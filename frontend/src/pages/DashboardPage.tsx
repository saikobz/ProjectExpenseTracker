import { ArrowDownCircle, ArrowUpCircle, Scale, Tag, Wallet } from 'lucide-react'
import { useState } from 'react'
import { DashboardSkeleton } from '@/components/charts/DashboardSkeleton'
import { ExpensePieChart } from '@/components/charts/ExpensePieChart'
import { MonthYearSelector } from '@/components/charts/MonthYearSelector'
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart'
import { RecentTransactions } from '@/components/charts/RecentTransactions'
import { SummaryCard } from '@/components/charts/SummaryCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboard'
import type { DashboardPeriod } from '@/types/dashboard'

function getCurrentPeriod(): DashboardPeriod {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

function formatMoney(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function DashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>(getCurrentPeriod)

  const [summaryQuery, categoryQuery, trendQuery, recentQuery] = useDashboardData(period)

  const isLoading =
    summaryQuery.isLoading ||
    categoryQuery.isLoading ||
    trendQuery.isLoading ||
    recentQuery.isLoading

  const isError =
    summaryQuery.isError ||
    categoryQuery.isError ||
    trendQuery.isError ||
    recentQuery.isError

  const summary = summaryQuery.data
  const categoryExpenses = categoryQuery.data ?? []
  const monthlyTrend = trendQuery.data ?? []
  const recentTransactions = recentQuery.data ?? []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your financial overview</p>
        </div>
        <DashboardSkeleton />
      </div>
    )
  }

  if (isError || !summary) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your financial overview</p>
        </div>
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Failed to load dashboard. Please refresh the page.
        </p>
      </div>
    )
  }

  const isEmpty =
    summary.transactionCount === 0 &&
    categoryExpenses.length === 0 &&
    monthlyTrend.every((m) => m.income === 0 && m.expense === 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview for {period.month}/{period.year}
          </p>
        </div>
        <MonthYearSelector period={period} onChange={setPeriod} />
      </div>

      {isEmpty && (
        <p className="rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
          No transactions for this period yet. Add transactions to see your dashboard.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total income"
          value={formatMoney(summary.totalIncome)}
          icon={ArrowUpCircle}
          valueClassName="text-green-600"
        />
        <SummaryCard
          title="Total expense"
          value={formatMoney(summary.totalExpense)}
          icon={ArrowDownCircle}
          valueClassName="text-red-600"
        />
        <SummaryCard
          title="Balance"
          value={formatMoney(summary.balance)}
          icon={Scale}
          valueClassName={summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}
          description="Income minus expense"
        />
        <SummaryCard
          title="Top spending"
          value={
            summary.topExpenseCategory
              ? formatMoney(summary.topExpenseCategory.amount)
              : '—'
          }
          description={summary.topExpenseCategory?.categoryName ?? 'No expenses'}
          icon={Tag}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expense by category</CardTitle>
            <CardDescription>Where your money went this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpensePieChart data={categoryExpenses} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Income vs expense</CardTitle>
            <CardDescription>Monthly trend for {period.year}</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyTrendChart data={monthlyTrend} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent transactions</CardTitle>
            <CardDescription>{summary.transactionCount} transactions this month</CardDescription>
          </div>
          <Wallet className="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <RecentTransactions transactions={recentTransactions} />
        </CardContent>
      </Card>
    </div>
  )
}

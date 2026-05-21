import { ArrowDownCircle, ArrowUpCircle, Scale, Tag } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChartCard } from '@/components/common/ChartCard'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { SummaryCard } from '@/components/common/SummaryCard'
import { ExpensePieChart } from '@/components/charts/ExpensePieChart'
import { MonthYearSelector } from '@/components/charts/MonthYearSelector'
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart'
import { RecentTransactions } from '@/components/charts/RecentTransactions'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboard'
import { formatMoney } from '@/lib/format'
import type { DashboardPeriod } from '@/types/dashboard'

function getCurrentPeriod(): DashboardPeriod {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
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

  const refetchAll = () => {
    void summaryQuery.refetch()
    void categoryQuery.refetch()
    void trendQuery.refetch()
    void recentQuery.refetch()
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Dashboard" subtitle="Your financial overview" />
        <LoadingSkeleton preset="dashboard" />
      </div>
    )
  }

  if (isError || !summaryQuery.data) {
    return (
      <div className="space-y-8">
        <PageHeader title="Dashboard" subtitle="Your financial overview" />
        <ErrorState onRetry={refetchAll} />
      </div>
    )
  }

  const summary = summaryQuery.data
  const categoryExpenses = categoryQuery.data ?? []
  const monthlyTrend = trendQuery.data ?? []
  const recentTransactions = recentQuery.data ?? []

  const isEmpty =
    summary.transactionCount === 0 &&
    categoryExpenses.length === 0 &&
    monthlyTrend.every((m) => m.income === 0 && m.expense === 0)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle={`Overview for ${period.month}/${period.year}`}
        actions={<MonthYearSelector period={period} onChange={setPeriod} />}
      />

      {isEmpty && (
        <EmptyState
          title="No activity this period"
          description="Add transactions to see income, expenses, and charts on your dashboard."
          actionLabel="Add transaction"
          actionHref="/transactions"
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total income"
          value={formatMoney(summary.totalIncome)}
          icon={ArrowUpCircle}
          valueClassName="text-success-foreground"
        />
        <SummaryCard
          title="Total expense"
          value={formatMoney(summary.totalExpense)}
          icon={ArrowDownCircle}
          valueClassName="text-danger-foreground"
        />
        <SummaryCard
          title="Balance"
          value={formatMoney(summary.balance)}
          icon={Scale}
          valueClassName={
            summary.balance >= 0 ? 'text-success-foreground' : 'text-danger-foreground'
          }
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
        <ChartCard
          title="Expense by category"
          description="Where your money went this month"
        >
          <ExpensePieChart data={categoryExpenses} />
        </ChartCard>

        <ChartCard
          title="Income vs expense"
          description={`Monthly trend for ${period.year}`}
        >
          <MonthlyTrendChart data={monthlyTrend} />
        </ChartCard>
      </div>

      <ChartCard
        title="Recent transactions"
        description={`${summary.transactionCount} transactions this month`}
        footer={
          <Link to="/transactions" className="font-medium text-primary hover:underline">
            View all transactions
          </Link>
        }
      >
        <RecentTransactions transactions={recentTransactions} />
      </ChartCard>
    </div>
  )
}

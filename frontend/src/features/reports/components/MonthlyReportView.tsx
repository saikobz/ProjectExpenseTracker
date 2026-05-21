import { ArrowDownCircle, ArrowUpCircle, Scale, Tag, TrendingDown, TrendingUp } from 'lucide-react'
import { ChartCard } from '@/components/common/ChartCard'
import { MoneyAmount } from '@/components/common/MoneyAmount'
import { SummaryCard } from '@/components/common/SummaryCard'
import { CategoryBreakdownChart } from '@/features/reports/components/CategoryBreakdownChart'
import { ReportTransactionTable } from '@/features/reports/components/ReportTransactionTable'
import { formatMoney } from '@/lib/format'
import type { MonthlyReport } from '@/types/report'

type MonthlyReportViewProps = {
  report: MonthlyReport
}

export function MonthlyReportView({ report }: MonthlyReportViewProps) {
  const changePositive = report.expenseChangeAmount <= 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total income"
          value={formatMoney(report.totalIncome)}
          icon={ArrowUpCircle}
          valueClassName="text-success-foreground"
        />
        <SummaryCard
          title="Total expense"
          value={formatMoney(report.totalExpense)}
          icon={ArrowDownCircle}
          valueClassName="text-danger-foreground"
        />
        <SummaryCard
          title="Balance"
          value={formatMoney(report.balance)}
          icon={Scale}
          valueClassName={
            report.balance >= 0 ? 'text-success-foreground' : 'text-danger-foreground'
          }
        />
        <SummaryCard
          title="Expense vs last month"
          value={`${changePositive ? '' : '+'}${formatMoney(Math.abs(report.expenseChangeAmount))}`}
          description={`${report.expenseChangePercentage >= 0 ? '+' : ''}${report.expenseChangePercentage}% (${formatMoney(report.previousMonthExpense)} prev.)`}
          icon={changePositive ? TrendingDown : TrendingUp}
          valueClassName={
            changePositive ? 'text-success-foreground' : 'text-danger-foreground'
          }
        />
      </div>

      {report.topExpenseCategory && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-gradient-to-br from-danger/8 via-card to-card p-5 shadow-sm ring-1 ring-border/40">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-danger/15">
              <Tag className="size-5 text-danger-foreground" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Top expense category</p>
              <p className="mt-1 text-xl font-semibold tracking-tight">
                {report.topExpenseCategory.categoryName}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Largest share of spending this period
              </p>
            </div>
          </div>
          <MoneyAmount
            amount={report.topExpenseCategory.amount}
            type="expense"
            className="text-2xl font-semibold"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Income by category" description="Share of total income">
          <CategoryBreakdownChart data={report.incomeByCategory} />
        </ChartCard>
        <ChartCard title="Expense by category" description="Share of total expense">
          <CategoryBreakdownChart data={report.expenseByCategory} />
        </ChartCard>
      </div>

      <ChartCard
        title="Transactions"
        description={`${report.transactionCount} records in this period`}
      >
        <ReportTransactionTable transactions={report.transactions} />
      </ChartCard>
    </div>
  )
}

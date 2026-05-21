import { ArrowDownCircle, ArrowUpCircle, CalendarRange, Scale } from 'lucide-react'
import { ChartCard } from '@/components/common/ChartCard'
import { MoneyAmount } from '@/components/common/MoneyAmount'
import { SummaryCard } from '@/components/common/SummaryCard'
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart'
import { formatMoney } from '@/lib/format'
import type { YearlyReport } from '@/types/report'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

type YearlyReportViewProps = {
  report: YearlyReport
  year: number
}

export function YearlyReportView({ report, year }: YearlyReportViewProps) {
  const expenseItems = report.categoryBreakdown.filter((c) => c.type === 'expense')
  const incomeItems = report.categoryBreakdown.filter((c) => c.type === 'income')

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Yearly income"
          value={formatMoney(report.totalIncome)}
          icon={ArrowUpCircle}
          valueClassName="text-success-foreground"
        />
        <SummaryCard
          title="Yearly expense"
          value={formatMoney(report.totalExpense)}
          icon={ArrowDownCircle}
          valueClassName="text-danger-foreground"
        />
        <SummaryCard
          title="Yearly balance"
          value={formatMoney(report.balance)}
          icon={Scale}
          valueClassName={
            report.balance >= 0 ? 'text-success-foreground' : 'text-danger-foreground'
          }
        />
      </div>

      {(report.highestExpenseMonth || report.lowestExpenseMonth) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {report.highestExpenseMonth && (
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-danger/8 to-card p-5 ring-1 ring-border/40">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-danger/15">
                  <CalendarRange className="size-5 text-danger-foreground" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">Highest expense month</p>
                  <p className="font-semibold">
                    {MONTH_NAMES[report.highestExpenseMonth.month - 1]} {year}
                  </p>
                </div>
                <MoneyAmount
                  amount={report.highestExpenseMonth.amount}
                  type="expense"
                  className="text-lg font-semibold"
                />
              </div>
            </div>
          )}
          {report.lowestExpenseMonth && (
            <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-success/8 to-card p-5 ring-1 ring-border/40">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-success/15">
                  <CalendarRange className="size-5 text-success-foreground" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">Lowest expense month</p>
                  <p className="font-semibold">
                    {MONTH_NAMES[report.lowestExpenseMonth.month - 1]} {year}
                  </p>
                </div>
                <MoneyAmount
                  amount={report.lowestExpenseMonth.amount}
                  type="expense"
                  className="text-lg font-semibold"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <ChartCard
        title="Monthly income vs expense"
        description={`Twelve-month trend for ${year}`}
      >
        <MonthlyTrendChart data={report.monthlyBreakdown} />
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Top income categories" description="By share of yearly income">
          {incomeItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No income data.</p>
          ) : (
            <ul className="space-y-1">
              {incomeItems.slice(0, 8).map((item) => (
                <li
                  key={item.categoryId}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/40"
                >
                  <span className="truncate text-sm font-medium">{item.categoryName}</span>
                  <span className="shrink-0 text-sm tabular-nums text-success-foreground">
                    {formatMoney(item.amount)}{' '}
                    <span className="text-muted-foreground">({item.percentage}%)</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
        <ChartCard title="Top expense categories" description="By share of yearly expense">
          {expenseItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No expense data.</p>
          ) : (
            <ul className="space-y-1">
              {expenseItems.slice(0, 8).map((item) => (
                <li
                  key={item.categoryId}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/40"
                >
                  <span className="truncate text-sm font-medium">{item.categoryName}</span>
                  <span className="shrink-0 text-sm tabular-nums text-danger-foreground">
                    {formatMoney(item.amount)}{' '}
                    <span className="text-muted-foreground">({item.percentage}%)</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>
    </div>
  )
}

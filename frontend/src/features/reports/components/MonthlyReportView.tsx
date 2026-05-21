import { ArrowDownCircle, ArrowUpCircle, Scale, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryBreakdownChart } from '@/features/reports/components/CategoryBreakdownChart'
import { ExportCsvButton } from '@/features/reports/components/ExportCsvButton'
import { ReportSummaryCard } from '@/features/reports/components/ReportSummaryCard'
import { ReportTransactionTable } from '@/features/reports/components/ReportTransactionTable'
import { getMonthDateRangeForExport } from '@/services/report.service'
import type { MonthlyReport, MonthlyReportPeriod } from '@/types/report'

function formatMoney(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

type MonthlyReportViewProps = {
  report: MonthlyReport
  period: MonthlyReportPeriod
}

export function MonthlyReportView({ report, period }: MonthlyReportViewProps) {
  const exportRange = getMonthDateRangeForExport(period.year, period.month)
  const changePositive = report.expenseChangeAmount <= 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2">
        <ExportCsvButton params={exportRange} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportSummaryCard
          title="Total income"
          value={formatMoney(report.totalIncome)}
          icon={ArrowUpCircle}
          valueClassName="text-green-600"
        />
        <ReportSummaryCard
          title="Total expense"
          value={formatMoney(report.totalExpense)}
          icon={ArrowDownCircle}
          valueClassName="text-red-600"
        />
        <ReportSummaryCard
          title="Balance"
          value={formatMoney(report.balance)}
          icon={Scale}
          valueClassName={report.balance >= 0 ? 'text-green-600' : 'text-red-600'}
        />
        <ReportSummaryCard
          title="Expense vs last month"
          value={`${changePositive ? '' : '+'}${formatMoney(Math.abs(report.expenseChangeAmount))}`}
          description={`${report.expenseChangePercentage >= 0 ? '+' : ''}${report.expenseChangePercentage}% (${formatMoney(report.previousMonthExpense)} prev.)`}
          icon={changePositive ? TrendingDown : TrendingUp}
          valueClassName={changePositive ? 'text-green-600' : 'text-red-600'}
        />
      </div>

      {report.topExpenseCategory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top expense category</CardTitle>
            <CardDescription>
              {report.topExpenseCategory.categoryName} —{' '}
              {formatMoney(report.topExpenseCategory.amount)}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Income by category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBreakdownChart data={report.incomeByCategory} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expense by category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBreakdownChart data={report.expenseByCategory} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transactions ({report.transactionCount})</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportTransactionTable transactions={report.transactions} />
        </CardContent>
      </Card>
    </div>
  )
}

import { ArrowDownCircle, ArrowUpCircle, Scale } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart'
import { ExportCsvButton } from '@/features/reports/components/ExportCsvButton'
import { ReportSummaryCard } from '@/features/reports/components/ReportSummaryCard'
import type { YearlyReport } from '@/types/report'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function formatMoney(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

type YearlyReportViewProps = {
  report: YearlyReport
  year: number
}

export function YearlyReportView({ report, year }: YearlyReportViewProps) {
  const expenseItems = report.categoryBreakdown.filter((c) => c.type === 'expense')
  const incomeItems = report.categoryBreakdown.filter((c) => c.type === 'income')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2">
        <ExportCsvButton params={{ from: `${year}-01-01`, to: `${year}-12-31` }} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ReportSummaryCard
          title="Yearly income"
          value={formatMoney(report.totalIncome)}
          icon={ArrowUpCircle}
          valueClassName="text-green-600"
        />
        <ReportSummaryCard
          title="Yearly expense"
          value={formatMoney(report.totalExpense)}
          icon={ArrowDownCircle}
          valueClassName="text-red-600"
        />
        <ReportSummaryCard
          title="Yearly balance"
          value={formatMoney(report.balance)}
          icon={Scale}
          valueClassName={report.balance >= 0 ? 'text-green-600' : 'text-red-600'}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {report.highestExpenseMonth && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Highest expense month</CardTitle>
              <CardDescription>
                {MONTH_NAMES[report.highestExpenseMonth.month - 1]} —{' '}
                {formatMoney(report.highestExpenseMonth.amount)}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        {report.lowestExpenseMonth && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lowest expense month</CardTitle>
              <CardDescription>
                {MONTH_NAMES[report.lowestExpenseMonth.month - 1]} —{' '}
                {formatMoney(report.lowestExpenseMonth.amount)}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly income vs expense</CardTitle>
          <CardDescription>Full year {year}</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyTrendChart data={report.monthlyBreakdown} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top income categories</CardTitle>
          </CardHeader>
          <CardContent>
            {incomeItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No income data.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {incomeItems.slice(0, 8).map((item) => (
                  <li key={item.categoryId} className="flex justify-between gap-2">
                    <span>{item.categoryName}</span>
                    <span className="font-medium tabular-nums text-green-600">
                      {formatMoney(item.amount)} ({item.percentage}%)
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top expense categories</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No expense data.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {expenseItems.slice(0, 8).map((item) => (
                  <li key={item.categoryId} className="flex justify-between gap-2">
                    <span>{item.categoryName}</span>
                    <span className="font-medium tabular-nums text-red-600">
                      {formatMoney(item.amount)} ({item.percentage}%)
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

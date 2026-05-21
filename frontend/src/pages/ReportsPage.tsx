import { useState } from 'react'
import { MonthYearSelector } from '@/components/charts/MonthYearSelector'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MonthlyReportView } from '@/features/reports/components/MonthlyReportView'
import { YearlyReportView } from '@/features/reports/components/YearlyReportView'
import { useMonthlyReport, useYearlyReport } from '@/features/reports/hooks/useReports'
import type { MonthlyReportPeriod } from '@/types/report'

function getCurrentPeriod(): MonthlyReportPeriod {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

export function ReportsPage() {
  const [period, setPeriod] = useState<MonthlyReportPeriod>(getCurrentPeriod)
  const [tab, setTab] = useState<'monthly' | 'yearly'>('monthly')

  const monthlyQuery = useMonthlyReport(period)
  const yearlyQuery = useYearlyReport(period.year)

  const isLoading = tab === 'monthly' ? monthlyQuery.isLoading : yearlyQuery.isLoading
  const isError = tab === 'monthly' ? monthlyQuery.isError : yearlyQuery.isError

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Monthly and yearly financial reports with CSV export.
          </p>
        </div>
        <MonthYearSelector period={period} onChange={setPeriod} />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'monthly' | 'yearly')}>
        <TabsList>
          <TabsTrigger value="monthly">Monthly report</TabsTrigger>
          <TabsTrigger value="yearly">Yearly report</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="mt-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading monthly report...</p>
          )}
          {isError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Failed to load monthly report.
            </p>
          )}
          {!isLoading && !isError && monthlyQuery.data &&
            (monthlyQuery.data.transactionCount === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No transactions for {period.month}/{period.year}. Add transactions to
                  generate a report.
                </CardContent>
              </Card>
            ) : (
              <MonthlyReportView report={monthlyQuery.data} period={period} />
            ))}
        </TabsContent>

        <TabsContent value="yearly" className="mt-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading yearly report...</p>
          )}
          {isError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Failed to load yearly report.
            </p>
          )}
          {!isLoading && !isError && yearlyQuery.data &&
            (yearlyQuery.data.totalIncome === 0 && yearlyQuery.data.totalExpense === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No transactions for {period.year}. Add transactions to generate a report.
                </CardContent>
              </Card>
            ) : (
              <YearlyReportView report={yearlyQuery.data} year={period.year} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { BarChart3 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { TabbedPageChrome } from '@/components/common/TabbedPageChrome'
import { MonthYearSelector } from '@/components/charts/MonthYearSelector'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExportCsvButton } from '@/features/reports/components/ExportCsvButton'
import { MonthlyReportView } from '@/features/reports/components/MonthlyReportView'
import { YearlyReportView } from '@/features/reports/components/YearlyReportView'
import { useMonthlyReport, useYearlyReport } from '@/features/reports/hooks/useReports'
import { formatReportSubtitle } from '@/lib/period-label'
import { getMonthDateRangeForExport } from '@/services/report.service'
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

  const subtitle = formatReportSubtitle(period.month, period.year, tab)

  const canExport = useMemo(() => {
    if (tab === 'monthly') {
      return (
        monthlyQuery.data != null &&
        monthlyQuery.data.transactionCount > 0
      )
    }
    const report = yearlyQuery.data
    return report != null && (report.totalIncome > 0 || report.totalExpense > 0)
  }, [tab, monthlyQuery.data, yearlyQuery.data])

  const exportParams = useMemo(() => {
    if (tab === 'monthly') {
      return getMonthDateRangeForExport(period.year, period.month)
    }
    return { from: `${period.year}-01-01`, to: `${period.year}-12-31` }
  }, [tab, period.month, period.year])

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as 'monthly' | 'yearly')} className="w-full">
      <TabbedPageChrome
        title="Reports"
        subtitle={subtitle}
        tabs={
          <TabsList variant="segmented">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        }
        controls={
          <>
            <MonthYearSelector period={period} onChange={setPeriod} layout="stacked" />
            {canExport && !isLoading && !isError ? (
              <ExportCsvButton params={exportParams} className="h-9 w-full" />
            ) : null}
          </>
        }
      >
        <TabsContent value="monthly" className="mt-0 space-y-6">
          {isLoading && <LoadingSkeleton preset="dashboard" />}
          {isError && <ErrorState onRetry={() => void monthlyQuery.refetch()} />}
          {!isLoading && !isError && monthlyQuery.data &&
            (monthlyQuery.data.transactionCount === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No data for this month"
                description={`Add transactions for ${period.month}/${period.year} to generate a report.`}
                actionLabel="Add transaction"
                actionHref="/transactions"
              />
            ) : (
              <MonthlyReportView report={monthlyQuery.data} />
            ))}
        </TabsContent>

        <TabsContent value="yearly" className="mt-0 space-y-6">
          {isLoading && <LoadingSkeleton preset="dashboard" />}
          {isError && <ErrorState onRetry={() => void yearlyQuery.refetch()} />}
          {!isLoading && !isError && yearlyQuery.data &&
            (yearlyQuery.data.totalIncome === 0 && yearlyQuery.data.totalExpense === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No data for this year"
                description={`Add transactions in ${period.year} to generate a yearly report.`}
                actionLabel="Add transaction"
                actionHref="/transactions"
              />
            ) : (
              <YearlyReportView report={yearlyQuery.data} year={period.year} />
            ))}
        </TabsContent>
      </TabbedPageChrome>
    </Tabs>
  )
}

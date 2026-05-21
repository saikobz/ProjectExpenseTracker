import { getApiErrorMessage } from '@/lib/api-error'
import { api } from '@/services/api'
import type {
  CsvExportParams,
  MonthlyReport,
  MonthlyReportPeriod,
  YearlyReport,
} from '@/types/report'

type MonthlyReportResponse = {
  success: true
  data: { report: MonthlyReport }
}

type YearlyReportResponse = {
  success: true
  data: { report: YearlyReport }
}

export async function getMonthlyReport(period: MonthlyReportPeriod): Promise<MonthlyReport> {
  const { data } = await api.get<MonthlyReportResponse>('/api/reports/monthly', { params: period })
  return data.data.report
}

export async function getYearlyReport(year: number): Promise<YearlyReport> {
  const { data } = await api.get<YearlyReportResponse>('/api/reports/yearly', {
    params: { year },
  })
  return data.data.report
}

export async function exportCsv(params: CsvExportParams): Promise<void> {
  const response = await api.get<Blob>('/api/reports/export-csv', {
    params,
    responseType: 'blob',
  })

  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `moneymind-transactions-${params.from}-to-${params.to}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export function getMonthDateRangeForExport(year: number, month: number) {
  const monthStr = String(month).padStart(2, '0')
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const dayStr = String(lastDay).padStart(2, '0')
  return {
    from: `${year}-${monthStr}-01`,
    to: `${year}-${monthStr}-${dayStr}`,
  }
}

export function getReportErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, 'Failed to load report data.')
}

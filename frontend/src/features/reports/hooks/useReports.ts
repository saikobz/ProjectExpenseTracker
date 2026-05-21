import { useMutation, useQuery } from '@tanstack/react-query'
import * as reportService from '@/services/report.service'
import type { CsvExportParams, MonthlyReportPeriod } from '@/types/report'

export const reportKeys = {
  all: ['reports'] as const,
  monthly: (period: MonthlyReportPeriod) => [...reportKeys.all, 'monthly', period] as const,
  yearly: (year: number) => [...reportKeys.all, 'yearly', year] as const,
}

export function useMonthlyReport(period: MonthlyReportPeriod) {
  return useQuery({
    queryKey: reportKeys.monthly(period),
    queryFn: () => reportService.getMonthlyReport(period),
  })
}

export function useYearlyReport(year: number) {
  return useQuery({
    queryKey: reportKeys.yearly(year),
    queryFn: () => reportService.getYearlyReport(year),
  })
}

export function useExportCsv() {
  return useMutation({
    mutationFn: (params: CsvExportParams) => reportService.exportCsv(params),
  })
}

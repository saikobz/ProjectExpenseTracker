import { z } from 'zod'
import { dateStringSchema, monthSchema, yearSchema } from './common.validation.js'

export const reportMonthYearQuerySchema = z.object({
  month: monthSchema.optional(),
  year: yearSchema.optional(),
})

export const reportYearQuerySchema = z.object({
  year: yearSchema.optional(),
})

export const reportExportCsvQuerySchema = z.object({
  from: dateStringSchema,
  to: dateStringSchema,
  type: z.enum(['income', 'expense']).optional(),
  categoryId: z.uuid().optional(),
})

export type ReportMonthYearQuery = z.infer<typeof reportMonthYearQuerySchema>
export type ReportYearQuery = z.infer<typeof reportYearQuerySchema>
export type ReportExportCsvQuery = z.infer<typeof reportExportCsvQuerySchema>

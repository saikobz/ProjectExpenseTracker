import { z } from 'zod'
import { monthSchema, yearSchema } from './common.validation.js'

export const dashboardMonthYearQuerySchema = z.object({
  month: monthSchema.optional(),
  year: yearSchema.optional(),
})

export const dashboardYearQuerySchema = z.object({
  year: yearSchema.optional(),
})

export const dashboardRecentQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(20).default(5),
})

export type DashboardMonthYearQuery = z.infer<typeof dashboardMonthYearQuerySchema>
export type DashboardYearQuery = z.infer<typeof dashboardYearQuerySchema>
export type DashboardRecentQuery = z.infer<typeof dashboardRecentQuerySchema>

import { z } from 'zod'

const monthSchema = z.coerce.number().int().min(1).max(12)
const yearSchema = z.coerce.number().int().min(2000).max(2100)

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

import { z } from 'zod'

export const monthSchema = z.coerce.number().int().min(1).max(12)
export const yearSchema = z.coerce.number().int().min(2000).max(2100)

export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date')

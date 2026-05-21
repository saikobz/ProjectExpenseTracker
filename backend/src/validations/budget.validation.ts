import { z } from 'zod'
import { monthSchema, yearSchema } from './common.validation.js'

export const budgetListQuerySchema = z.object({
  month: monthSchema.optional(),
  year: yearSchema.optional(),
})

export const createBudgetSchema = z.object({
  categoryId: z.uuid('Invalid category ID'),
  month: monthSchema,
  year: yearSchema,
  amount: z.coerce.number().positive('Amount must be greater than 0'),
})

export const updateBudgetSchema = z
  .object({
    categoryId: z.uuid('Invalid category ID').optional(),
    month: monthSchema.optional(),
    year: yearSchema.optional(),
    amount: z.coerce.number().positive('Amount must be greater than 0').optional(),
  })
  .refine(
    (data) =>
      data.categoryId !== undefined ||
      data.month !== undefined ||
      data.year !== undefined ||
      data.amount !== undefined,
    { message: 'At least one field is required' },
  )

export type BudgetListQuery = z.infer<typeof budgetListQuerySchema>
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>

import { z } from 'zod'
import { dateStringSchema } from './common.validation.js'

const categoryTypeSchema = z.enum(['income', 'expense'])

export const createTransactionSchema = z.object({
  type: categoryTypeSchema,
  categoryId: z.uuid('Invalid category ID'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z.string().trim().max(255).optional().nullable(),
  transactionDate: dateStringSchema,
  paymentMethod: z.string().trim().max(50).optional().nullable(),
})

export const updateTransactionSchema = z
  .object({
    type: categoryTypeSchema.optional(),
    categoryId: z.uuid('Invalid category ID').optional(),
    amount: z.coerce.number().positive('Amount must be greater than 0').optional(),
    description: z.string().trim().max(255).optional().nullable(),
    transactionDate: dateStringSchema.optional(),
    paymentMethod: z.string().trim().max(50).optional().nullable(),
  })
  .refine(
    (data) =>
      data.type !== undefined ||
      data.categoryId !== undefined ||
      data.amount !== undefined ||
      data.description !== undefined ||
      data.transactionDate !== undefined ||
      data.paymentMethod !== undefined,
    { message: 'At least one field is required' },
  )

export const transactionListQuerySchema = z.object({
  type: categoryTypeSchema.optional(),
  categoryId: z.uuid().optional(),
  from: dateStringSchema.optional(),
  to: dateStringSchema.optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(['date', 'amount']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type TransactionListQueryInput = z.infer<typeof transactionListQuerySchema>

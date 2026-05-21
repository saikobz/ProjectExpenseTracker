import { z } from 'zod'

const categoryTypeSchema = z.enum(['income', 'expense'])

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  type: categoryTypeSchema,
  color: z
    .string()
    .trim()
    .optional()
    .refine((v) => v === undefined || v === '' || /^#[0-9A-Fa-f]{6}$/.test(v), {
      message: 'Color must be a valid hex code (e.g. #8B5CF6)',
    })
    .transform((v) => (v === '' || v === undefined ? undefined : v)),
})

export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    color: z
      .string()
      .trim()
      .optional()
      .refine((v) => v === undefined || v === null || v === '' || /^#[0-9A-Fa-f]{6}$/.test(v), {
        message: 'Color must be a valid hex code (e.g. #8B5CF6)',
      })
      .transform((v) => (v === '' ? null : v)),
  })
  .refine((data) => data.name !== undefined || data.color !== undefined, {
    message: 'At least one field (name or color) is required',
  })

export const categoryQuerySchema = z.object({
  type: categoryTypeSchema.optional(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CategoryQueryInput = z.infer<typeof categoryQuerySchema>

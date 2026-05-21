import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Category, CategoryType } from '@/types/category'

const categoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  type: z.enum(['income', 'expense']),
  color: z
    .string()
    .optional()
    .refine((v) => !v || /^#[0-9A-Fa-f]{6}$/.test(v), 'Use a valid hex color (e.g. #8B5CF6)'),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>

type CategoryFormProps = {
  defaultType: CategoryType
  category?: Category
  onSubmit: (values: CategoryFormValues) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  error?: string | null
}

export function CategoryForm({
  defaultType,
  category,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: CategoryFormProps) {
  const isEdit = !!category

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? '',
      type: category?.type ?? defaultType,
      color: category?.color ?? '#6366F1',
    },
  })

  const colorValue = watch('color') || '#6366F1'

  useEffect(() => {
    reset({
      name: category?.name ?? '',
      type: category?.type ?? defaultType,
      color: category?.color ?? '#6366F1',
    })
  }, [category, defaultType, reset])

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          color: values.color?.trim() ? values.color : undefined,
        })
      })}
      className="space-y-4"
    >
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            {...register('type')}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="color">Color (hex)</Label>
        <div className="flex gap-2">
          <Input id="color" placeholder="#8B5CF6" {...register('color')} className="flex-1" />
          <input
            type="color"
            aria-label="Pick color"
            className="size-9 cursor-pointer rounded-md border border-input"
            value={colorValue}
            onChange={(e) => setValue('color', e.target.value, { shouldValidate: true })}
          />
        </div>
        {errors.color && <p className="text-sm text-destructive">{errors.color.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add category'}
        </Button>
      </div>
    </form>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type { BudgetPeriod, BudgetWithUsage } from '@/types/budget'

const budgetFormSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  amount: z.number().positive('Amount must be greater than 0'),
})

export type BudgetFormValues = z.infer<typeof budgetFormSchema>

type BudgetFormProps = {
  period: BudgetPeriod
  budget?: BudgetWithUsage
  onSubmit: (values: BudgetFormValues) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  error?: string | null
}

export function BudgetForm({
  period,
  budget,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: BudgetFormProps) {
  const isEdit = !!budget
  const { data: categories = [], isLoading } = useCategories('expense')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: budget?.categoryId ?? '',
      month: budget?.month ?? period.month,
      year: budget?.year ?? period.year,
      amount: budget?.amount ?? 0,
    },
  })

  useEffect(() => {
    reset({
      categoryId: budget?.categoryId ?? '',
      month: budget?.month ?? period.month,
      year: budget?.year ?? period.year,
      amount: budget?.amount ?? 0,
    })
  }, [budget, period, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="space-y-2">
        <Label htmlFor="categoryId">Expense category</Label>
        <select
          id="categoryId"
          disabled={isEdit || isLoading || categories.length === 0}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm disabled:opacity-60"
          {...register('categoryId')}
        >
          {categories.length === 0 ? (
            <option value="">No expense categories</option>
          ) : (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          )}
        </select>
        {errors.categoryId && (
          <p className="text-sm text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="month">Month</Label>
          <Input
            id="month"
            type="number"
            min={1}
            max={12}
            disabled={isEdit}
            {...register('month', { valueAsNumber: true })}
          />
          {errors.month && <p className="text-sm text-destructive">{errors.month.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            min={2000}
            disabled={isEdit}
            {...register('year', { valueAsNumber: true })}
          />
          {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Budget amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || categories.length === 0}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add budget'}
        </Button>
      </div>
    </form>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCategories } from '@/features/categories/hooks/useCategories'
import type { CategoryType, Transaction } from '@/types/transaction'

const PAYMENT_METHODS = ['cash', 'transfer', 'credit card', 'e-wallet'] as const

const transactionFormSchema = z.object({
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  description: z.string().max(255).optional(),
  transactionDate: z.string().min(1, 'Date is required'),
  paymentMethod: z.string().optional(),
})

export type TransactionFormValues = z.infer<typeof transactionFormSchema>

type TransactionFormProps = {
  transaction?: Transaction
  defaultType?: CategoryType
  onSubmit: (values: TransactionFormValues) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  error?: string | null
}

export function TransactionForm({
  transaction,
  defaultType = 'expense',
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: TransactionFormProps) {
  const isEdit = !!transaction

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: transaction?.type ?? defaultType,
      categoryId: transaction?.categoryId ?? '',
      amount: transaction?.amount ?? 0,
      description: transaction?.description ?? '',
      transactionDate: transaction?.transactionDate ?? new Date().toISOString().slice(0, 10),
      paymentMethod: transaction?.paymentMethod ?? 'cash',
    },
  })

  const selectedType = watch('type')
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(selectedType)

  useEffect(() => {
    reset({
      type: transaction?.type ?? defaultType,
      categoryId: transaction?.categoryId ?? '',
      amount: transaction?.amount ?? 0,
      description: transaction?.description ?? '',
      transactionDate: transaction?.transactionDate ?? new Date().toISOString().slice(0, 10),
      paymentMethod: transaction?.paymentMethod ?? 'cash',
    })
  }, [transaction, defaultType, reset])

  useEffect(() => {
    if (!isEdit && categories.length > 0) {
      const current = watch('categoryId')
      const stillValid = categories.some((c) => c.id === current)
      if (!stillValid) {
        setValue('categoryId', categories[0].id)
      }
    }
  }, [categories, isEdit, setValue, watch])

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          ...values,
          description: values.description?.trim() || undefined,
          paymentMethod: values.paymentMethod || undefined,
        })
      })}
      className="space-y-4"
    >
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            disabled={isEdit}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm disabled:opacity-60"
            {...register('type')}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            {...register('categoryId')}
            disabled={categoriesLoading || categories.length === 0}
          >
            {categories.length === 0 ? (
              <option value="">No categories — create one first</option>
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            {...register('amount', { valueAsNumber: true })}
          />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionDate">Date</Label>
          <Input id="transactionDate" type="date" {...register('transactionDate')} />
          {errors.transactionDate && (
            <p className="text-sm text-destructive">{errors.transactionDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Optional note" {...register('description')} />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment method</Label>
        <select
          id="paymentMethod"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          {...register('paymentMethod')}
        >
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || categories.length === 0}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add transaction'}
        </Button>
      </div>
    </form>
  )
}

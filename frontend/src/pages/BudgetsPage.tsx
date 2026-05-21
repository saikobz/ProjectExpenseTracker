import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { PageHeaderButton } from '@/components/common/PageHeaderButton'
import { MonthYearSelector } from '@/components/charts/MonthYearSelector'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BudgetCard } from '@/features/budgets/components/BudgetCard'
import {
  BudgetForm,
  type BudgetFormValues,
} from '@/features/budgets/components/BudgetForm'
import {
  useBudgets,
  useCreateBudget,
  useDeleteBudget,
  useUpdateBudget,
} from '@/features/budgets/hooks/useBudgets'
import { getBudgetErrorMessage } from '@/services/budget.service'
import type { BudgetPeriod, BudgetWithUsage } from '@/types/budget'

function getCurrentPeriod(): BudgetPeriod {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

export function BudgetsPage() {
  const [period, setPeriod] = useState<BudgetPeriod>(getCurrentPeriod)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<BudgetWithUsage | null>(null)
  const [deleting, setDeleting] = useState<BudgetWithUsage | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { data: budgets = [], isLoading, isError, refetch } = useBudgets(period)
  const createMutation = useCreateBudget()
  const updateMutation = useUpdateBudget()
  const deleteMutation = useDeleteBudget()

  const openCreate = () => {
    setEditing(null)
    setFormError(null)
    setFormOpen(true)
  }

  const handleSubmit = async (values: BudgetFormValues) => {
    setFormError(null)
    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          input: { amount: values.amount },
        })
      } else {
        await createMutation.mutateAsync(values)
      }
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      setFormError(getBudgetErrorMessage(err))
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await deleteMutation.mutateAsync(deleting.id)
      setDeleting(null)
    } catch (err) {
      setFormError(getBudgetErrorMessage(err))
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Budgets"
        subtitle="Set monthly spending limits by expense category."
        actions={
          <>
            <MonthYearSelector period={period} onChange={setPeriod} />
            <PageHeaderButton onClick={openCreate}>
              <Plus className="size-4" />
              Add budget
            </PageHeaderButton>
          </>
        }
      />

      {isLoading && <LoadingSkeleton preset="budgetGrid" />}

      {isError && <ErrorState onRetry={() => void refetch()} />}

      {!isLoading && !isError && budgets.length === 0 && (
        <EmptyState
          title="No budgets this month"
          description={`Create a budget for ${period.month}/${period.year} to track spending limits.`}
          actionLabel="Add budget"
          onAction={openCreate}
        />
      )}

      {!isLoading && !isError && budgets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={(b) => {
                setEditing(b)
                setFormError(null)
                setFormOpen(true)
              }}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit budget' : 'Add budget'}</DialogTitle>
            <DialogDescription>
              {editing
                ? 'Update the budget amount for this category.'
                : 'Set a monthly limit for an expense category.'}
            </DialogDescription>
          </DialogHeader>
          <BudgetForm
            period={period}
            budget={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setFormOpen(false)
              setEditing(null)
            }}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
            error={formError}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete budget?"
        description={
          <>
            Remove the budget for &quot;{deleting?.categoryName}&quot; in {deleting?.month}/
            {deleting?.year}?
          </>
        }
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}

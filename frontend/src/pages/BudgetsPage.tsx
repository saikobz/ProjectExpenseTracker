import { Plus } from 'lucide-react'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
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

  const { data: budgets = [], isLoading, isError } = useBudgets(period)
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-sm text-muted-foreground">
            Set monthly spending limits by expense category.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Add budget
        </Button>
      </div>

      <MonthYearSelector period={period} onChange={setPeriod} />

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading budgets...</p>
      )}

      {isError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Failed to load budgets.
        </p>
      )}

      {!isLoading && !isError && budgets.length === 0 && (
        <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          No budgets for {period.month}/{period.year}. Add a budget to track spending limits.
        </p>
      )}

      {!isLoading && !isError && budgets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
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

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete budget?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove the budget for &quot;{deleting?.categoryName}&quot; in {deleting?.month}/
              {deleting?.year}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => void handleDelete()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

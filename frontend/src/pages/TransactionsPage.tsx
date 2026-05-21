import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCategories } from '@/features/categories/hooks/useCategories'
import {
  TransactionForm,
  type TransactionFormValues,
} from '@/features/transactions/components/TransactionForm'
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from '@/features/transactions/hooks/useTransactions'
import { getTransactionErrorMessage } from '@/services/transaction.service'
import type { CategoryType, Transaction, TransactionListParams } from '@/types/transaction'

function formatAmount(amount: number, type: CategoryType) {
  const formatted = amount.toLocaleString(undefined, { minimumFractionDigits: 2 })
  return type === 'income' ? `+${formatted}` : `-${formatted}`
}

const defaultFilters: TransactionListParams = {
  page: 1,
  limit: 10,
  sortBy: 'date',
  sortOrder: 'desc',
}

export function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionListParams>(defaultFilters)
  const [draft, setDraft] = useState({
    type: '' as '' | CategoryType,
    categoryId: '',
    from: '',
    to: '',
    search: '',
    sortBy: 'date' as 'date' | 'amount',
    sortOrder: 'desc' as 'asc' | 'desc',
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState<Transaction | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const listParams = useMemo<TransactionListParams>(
    () => ({
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      sortBy: filters.sortBy ?? 'date',
      sortOrder: filters.sortOrder ?? 'desc',
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.from ? { from: filters.from } : {}),
      ...(filters.to ? { to: filters.to } : {}),
      ...(filters.search ? { search: filters.search } : {}),
    }),
    [filters],
  )

  const { data, isLoading, isError } = useTransactions(listParams)
  const { data: allCategories = [] } = useCategories()
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  const applyFilters = () => {
    setFilters({
      ...defaultFilters,
      page: 1,
      sortBy: draft.sortBy,
      sortOrder: draft.sortOrder,
      ...(draft.type ? { type: draft.type } : {}),
      ...(draft.categoryId ? { categoryId: draft.categoryId } : {}),
      ...(draft.from ? { from: draft.from } : {}),
      ...(draft.to ? { to: draft.to } : {}),
      ...(draft.search.trim() ? { search: draft.search.trim() } : {}),
    })
  }

  const clearFilters = () => {
    setDraft({
      type: '',
      categoryId: '',
      from: '',
      to: '',
      search: '',
      sortBy: 'date',
      sortOrder: 'desc',
    })
    setFilters(defaultFilters)
  }

  const handleFormSubmit = async (values: TransactionFormValues) => {
    setFormError(null)
    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          input: {
            type: values.type,
            categoryId: values.categoryId,
            amount: values.amount,
            description: values.description ?? null,
            transactionDate: values.transactionDate,
            paymentMethod: values.paymentMethod ?? null,
          },
        })
      } else {
        await createMutation.mutateAsync({
          type: values.type,
          categoryId: values.categoryId,
          amount: values.amount,
          description: values.description ?? null,
          transactionDate: values.transactionDate,
          paymentMethod: values.paymentMethod ?? null,
        })
      }
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      setFormError(getTransactionErrorMessage(err))
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await deleteMutation.mutateAsync(deleting.id)
      setDeleting(null)
    } catch (err) {
      setFormError(getTransactionErrorMessage(err))
      setDeleting(null)
    }
  }

  const items = data?.items ?? []
  const page = data?.page ?? 1
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Record and manage your income and expenses.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setFormError(null)
            setFormOpen(true)
          }}
        >
          <Plus className="size-4" />
          Add transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Filter, search, and sort your transactions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={draft.type}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    type: e.target.value as '' | CategoryType,
                    categoryId: '',
                  }))
                }
              >
                <option value="">All</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={draft.categoryId}
                onChange={(e) => setDraft((d) => ({ ...d, categoryId: e.target.value }))}
              >
                <option value="">All</option>
                {allCategories
                  .filter((c) => !draft.type || c.type === draft.type)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Search description</Label>
              <Input
                placeholder="e.g. coffee"
                value={draft.search}
                onChange={(e) => setDraft((d) => ({ ...d, search: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>From</Label>
              <Input
                type="date"
                value={draft.from}
                onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Input
                type="date"
                value={draft.to}
                onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Sort</Label>
              <div className="flex gap-2">
                <select
                  className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={draft.sortBy}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, sortBy: e.target.value as 'date' | 'amount' }))
                  }
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      sortOrder: d.sortOrder === 'asc' ? 'desc' : 'asc',
                    }))
                  }
                  title={draft.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {draft.sortOrder === 'asc' ? (
                    <ArrowUp className="size-4" />
                  ) : (
                    <ArrowDown className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={applyFilters}>
              Apply filters
            </Button>
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaction list</CardTitle>
          <CardDescription>
            {data ? `${data.total} transaction(s)` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading transactions...</p>
          )}
          {isError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Failed to load transactions.
            </p>
          )}
          {!isLoading && !isError && items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No transactions found. Add your first transaction or adjust filters.
            </p>
          )}
          {!isLoading && !isError && items.length > 0 && (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 whitespace-nowrap">{tx.transactionDate}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate">
                        {tx.description || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: tx.category.color ?? '#6B7280' }}
                          />
                          {tx.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize">{tx.type}</td>
                      <td
                        className={`px-4 py-3 text-right font-medium tabular-nums ${
                          tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatAmount(tx.amount, tx.type)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditing(tx)
                              setFormError(null)
                              setFormOpen(true)
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => setDeleting(tx)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data && data.total > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit transaction' : 'Add transaction'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update transaction details.' : 'Record a new income or expense.'}
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            transaction={editing ?? undefined}
            defaultType={draft.type || 'expense'}
            onSubmit={handleFormSubmit}
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
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete
              {deleting?.description ? ` "${deleting.description}"` : ' this transaction'}.
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

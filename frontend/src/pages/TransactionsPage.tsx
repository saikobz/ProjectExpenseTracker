import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ChartCard } from '@/components/common/ChartCard'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { MoneyAmount } from '@/components/common/MoneyAmount'
import { PageHeader } from '@/components/common/PageHeader'
import { PageHeaderButton } from '@/components/common/PageHeaderButton'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
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

  const { data, isLoading, isError, refetch } = useTransactions(listParams)
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
    <div className="space-y-8">
      <PageHeader
        title="Transactions"
        subtitle="Record and manage your income and expenses."
        actions={
          <PageHeaderButton
            onClick={() => {
              setEditing(null)
              setFormError(null)
              setFormOpen(true)
            }}
          >
            <Plus className="size-4" />
            Add transaction
          </PageHeaderButton>
        }
      />

      <ChartCard
        title="Filters"
        description="Filter, search, and sort your transactions."
        contentClassName="space-y-4"
      >
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
                  aria-label={
                    draft.sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'
                  }
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
      </ChartCard>

      <ChartCard
        title="Transaction list"
        description={data ? `${data.total} transaction(s)` : 'Loading...'}
        contentClassName="space-y-4"
      >
          {isLoading && <LoadingSkeleton preset="table" />}
          {isError && (
            <ErrorState
              message="Failed to load transactions."
              onRetry={() => void refetch()}
            />
          )}
          {!isLoading && !isError && items.length === 0 && (
            <EmptyState
              title="No transactions found"
              description="Add your first transaction or adjust your filters."
              actionLabel="Add transaction"
              onAction={() => {
                setEditing(null)
                setFormError(null)
                setFormOpen(true)
              }}
            />
          )}
          {!isLoading && !isError && items.length > 0 && (
            <>
            <div className="hidden overflow-x-auto rounded-lg border border-border/60 md:block">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="sticky top-0 z-10 border-b bg-muted/80 backdrop-blur">
                  <tr>
                    <th className="px-4 py-3 font-medium" scope="col">Date</th>
                    <th className="px-4 py-3 font-medium" scope="col">Description</th>
                    <th className="px-4 py-3 font-medium" scope="col">Category</th>
                    <th className="px-4 py-3 font-medium" scope="col">Type</th>
                    <th className="px-4 py-3 font-medium text-right" scope="col">Amount</th>
                    <th className="px-4 py-3 font-medium text-right" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {items.map((tx, i) => (
                    <tr
                      key={tx.id}
                      className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20 hover:bg-muted/40'}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">{tx.transactionDate}</td>
                      <td className="max-w-[200px] truncate px-4 py-3">
                        {tx.description || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="size-2.5 shrink-0 rounded-full ring-1 ring-border/60"
                            style={{ backgroundColor: tx.category.color ?? '#6B7280' }}
                            aria-hidden
                          />
                          {tx.category.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge kind="transaction" type={tx.type} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        <MoneyAmount amount={tx.amount} type={tx.type} showSign />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${tx.description ?? 'transaction'}`}
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
                            aria-label={`Delete ${tx.description ?? 'transaction'}`}
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

            <div className="space-y-3 md:hidden">
              {items.map((tx) => (
                <div
                  key={tx.id}
                  className="rounded-lg border border-border/60 bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{tx.description || 'No description'}</p>
                      <p className="text-xs text-muted-foreground">{tx.transactionDate}</p>
                    </div>
                    <MoneyAmount amount={tx.amount} type={tx.type} showSign className="text-metric text-base" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{tx.category.name}</span>
                    <StatusBadge kind="transaction" type={tx.type} />
                  </div>
                  <div className="mt-3 flex justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(tx)
                        setFormOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleting(tx)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            </>
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
      </ChartCard>

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

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete transaction?"
        description={
          <>
            This will permanently delete
            {deleting?.description ? ` "${deleting.description}"` : ' this transaction'}.
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

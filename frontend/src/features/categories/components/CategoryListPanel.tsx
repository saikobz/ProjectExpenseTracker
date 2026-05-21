import { FolderOpen } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { CategoryCard } from '@/features/categories/components/CategoryCard'
import type { Category, CategoryType } from '@/types/category'

const PANEL_COPY: Record<
  CategoryType,
  { title: string; description: string; emptyTitle: string; emptyDescription: string }
> = {
  expense: {
    title: 'Expense categories',
    description: 'Organize spending by purpose — food, transport, bills, and more.',
    emptyTitle: 'No expense categories',
    emptyDescription: 'Create categories to classify outgoing transactions.',
  },
  income: {
    title: 'Income categories',
    description: 'Track salary, freelance, investments, and other income sources.',
    emptyTitle: 'No income categories',
    emptyDescription: 'Create categories to classify incoming transactions.',
  },
}

type CategoryListPanelProps = {
  type: CategoryType
  categories: Category[]
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onAdd: () => void
}

export function CategoryListPanel({
  type,
  categories,
  isLoading,
  isError,
  onRetry,
  onEdit,
  onDelete,
  onAdd,
}: CategoryListPanelProps) {
  const copy = PANEL_COPY[type]

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{copy.title}</h2>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
        {!isLoading && !isError && categories.length > 0 && (
          <p className="text-sm tabular-nums text-muted-foreground">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </p>
        )}
      </div>

      {isLoading && <LoadingSkeleton preset="list" />}

      {isError && <ErrorState onRetry={onRetry} />}

      {!isLoading && !isError && categories.length === 0 && (
        <EmptyState
          icon={FolderOpen}
          title={copy.emptyTitle}
          description={copy.emptyDescription}
          actionLabel="Add category"
          onAction={onAdd}
        />
      )}

      {!isLoading && !isError && categories.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}

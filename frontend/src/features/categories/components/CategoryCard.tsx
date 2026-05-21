import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types/category'
import { cn } from '@/lib/utils'

const DEFAULT_COLOR = '#6B7280'

type CategoryCardProps = {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const color = category.color ?? DEFAULT_COLOR

  return (
    <article
      className={cn(
        'group relative flex overflow-hidden rounded-xl border border-border/60 bg-card',
        'card-elevated transition-all hover:-translate-y-0.5 hover:shadow-md',
      )}
    >
      <div
        className="w-1.5 shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 items-center gap-3 p-4">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-border/50"
          style={{ backgroundColor: `${color}22` }}
          aria-hidden
        >
          <span
            className="size-4 rounded-full ring-2 ring-background/80"
            style={{ backgroundColor: color }}
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{category.name}</p>
          <p className="mt-0.5 text-xs capitalize text-muted-foreground">{category.type}</p>
        </div>
        <div className="flex shrink-0 gap-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={`Edit ${category.name}`}
            onClick={() => onEdit(category)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive"
            aria-label={`Delete ${category.name}`}
            onClick={() => onDelete(category)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  )
}

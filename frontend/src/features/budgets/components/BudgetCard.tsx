import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BudgetProgress } from '@/features/budgets/components/BudgetProgress'
import { BudgetStatusBadge } from '@/features/budgets/components/BudgetStatusBadge'
import type { BudgetWithUsage } from '@/types/budget'

type BudgetCardProps = {
  budget: BudgetWithUsage
  onEdit: (budget: BudgetWithUsage) => void
  onDelete: (budget: BudgetWithUsage) => void
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <span
            className="size-3 shrink-0 rounded-full"
            style={{ backgroundColor: budget.categoryColor ?? '#6B7280' }}
          />
          <CardTitle className="text-base">{budget.categoryName}</CardTitle>
        </div>
        <BudgetStatusBadge status={budget.status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <BudgetProgress
          spent={budget.spent}
          amount={budget.amount}
          usagePercentage={budget.usagePercentage}
          status={budget.status}
        />
        <p className="text-xs text-muted-foreground">
          Remaining:{' '}
          <span className={budget.remaining < 0 ? 'text-destructive font-medium' : ''}>
            {budget.remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </p>
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(budget)}>
            <Pencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(budget)}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

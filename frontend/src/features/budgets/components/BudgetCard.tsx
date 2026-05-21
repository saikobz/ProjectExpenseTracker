import { Pencil, Trash2 } from 'lucide-react'
import { MoneyAmount } from '@/components/common/MoneyAmount'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BudgetProgress } from '@/features/budgets/components/BudgetProgress'
import { BudgetStatusBadge } from '@/features/budgets/components/BudgetStatusBadge'
import type { BudgetWithUsage } from '@/types/budget'
import { cn } from '@/lib/utils'

type BudgetCardProps = {
  budget: BudgetWithUsage
  onEdit: (budget: BudgetWithUsage) => void
  onDelete: (budget: BudgetWithUsage) => void
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  return (
    <Card className="card-elevated transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <span
            className="size-3 shrink-0 rounded-full ring-1 ring-border/60"
            style={{ backgroundColor: budget.categoryColor ?? '#6B7280' }}
            aria-hidden
          />
          <CardTitle className="text-base font-semibold">{budget.categoryName}</CardTitle>
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
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-muted/50 px-2 py-2">
            <p className="text-muted-foreground">Spent</p>
            <MoneyAmount amount={budget.spent} type="expense" className="text-sm font-semibold" />
          </div>
          <div className="rounded-lg bg-muted/50 px-2 py-2">
            <p className="text-muted-foreground">Limit</p>
            <p className="text-sm font-semibold tabular-nums">
              {budget.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 px-2 py-2">
            <p className="text-muted-foreground">Left</p>
            <p
              className={cn(
                'text-sm font-semibold tabular-nums',
                budget.remaining < 0 ? 'text-danger-foreground' : 'text-foreground',
              )}
            >
              {budget.remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-1 border-t border-border/60 pt-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit budget for ${budget.categoryName}`}
            onClick={() => onEdit(budget)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            aria-label={`Delete budget for ${budget.categoryName}`}
            onClick={() => onDelete(budget)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

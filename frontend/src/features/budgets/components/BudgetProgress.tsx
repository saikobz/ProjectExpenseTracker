import { cn } from '@/lib/utils'
import type { BudgetStatus } from '@/types/budget'

type BudgetProgressProps = {
  spent: number
  amount: number
  usagePercentage: number
  status: BudgetStatus
}

export function BudgetProgress({ spent, amount, usagePercentage, status }: BudgetProgressProps) {
  const width = Math.min(usagePercentage, 100)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {spent.toLocaleString(undefined, { minimumFractionDigits: 2 })} /{' '}
          {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        <span>{usagePercentage}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            status === 'over_budget' && 'bg-destructive',
            status === 'warning' && 'bg-yellow-500',
            status === 'normal' && 'bg-primary',
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

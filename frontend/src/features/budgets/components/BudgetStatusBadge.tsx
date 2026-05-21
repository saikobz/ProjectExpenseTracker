import { cn } from '@/lib/utils'
import type { BudgetStatus } from '@/types/budget'

const STATUS_CONFIG: Record<
  BudgetStatus,
  { label: string; className: string }
> = {
  normal: {
    label: 'Normal',
    className: 'bg-green-500/10 text-green-700 dark:text-green-400',
  },
  warning: {
    label: 'Warning',
    className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  },
  over_budget: {
    label: 'Over Budget',
    className: 'bg-destructive/10 text-destructive',
  },
}

type BudgetStatusBadgeProps = {
  status: BudgetStatus
}

export function BudgetStatusBadge({ status }: BudgetStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
      )}
    >
      {config.label}
    </span>
  )
}

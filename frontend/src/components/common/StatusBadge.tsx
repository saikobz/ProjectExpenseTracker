import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { BudgetStatus } from '@/types/budget'
import { cn } from '@/lib/utils'

type TransactionType = 'income' | 'expense'

const budgetConfig: Record<
  BudgetStatus,
  { label: string; variant: 'success' | 'warning' | 'danger' }
> = {
  normal: { label: 'On track', variant: 'success' },
  warning: { label: 'Near limit', variant: 'warning' },
  over_budget: { label: 'Over budget', variant: 'danger' },
}

const transactionConfig: Record<
  TransactionType,
  { label: string; variant: 'success' | 'danger' }
> = {
  income: { label: 'Income', variant: 'success' },
  expense: { label: 'Expense', variant: 'danger' },
}

type StatusBadgeProps =
  | { kind: 'budget'; status: BudgetStatus; icon?: LucideIcon; className?: string }
  | { kind: 'transaction'; type: TransactionType; className?: string }

export function StatusBadge(props: StatusBadgeProps) {
  if (props.kind === 'budget') {
    const config = budgetConfig[props.status]
    const Icon = props.icon
    return (
      <Badge variant={config.variant} className={cn(props.className)}>
        {Icon && <Icon className="size-3" aria-hidden />}
        {config.label}
      </Badge>
    )
  }

  const config = transactionConfig[props.type]
  return (
    <Badge variant={config.variant} className={cn('capitalize', props.className)}>
      {config.label}
    </Badge>
  )
}

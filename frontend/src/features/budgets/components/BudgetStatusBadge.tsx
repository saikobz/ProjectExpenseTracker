import { StatusBadge } from '@/components/common/StatusBadge'
import type { BudgetStatus } from '@/types/budget'

type BudgetStatusBadgeProps = {
  status: BudgetStatus
}

export function BudgetStatusBadge({ status }: BudgetStatusBadgeProps) {
  return <StatusBadge kind="budget" status={status} />
}

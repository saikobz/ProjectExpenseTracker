import { formatMoney, type MoneyType } from '@/lib/format'
import { cn } from '@/lib/utils'

type MoneyAmountProps = {
  amount: number
  type?: MoneyType
  showSign?: boolean
  className?: string
  as?: 'span' | 'p'
}

const typeStyles: Record<MoneyType, string> = {
  income: 'text-success-foreground',
  expense: 'text-danger-foreground',
  neutral: 'text-foreground',
}

export function MoneyAmount({
  amount,
  type = 'neutral',
  showSign = false,
  className,
  as: Component = 'span',
}: MoneyAmountProps) {
  return (
    <Component className={cn('tabular-nums', typeStyles[type], className)}>
      {formatMoney(amount, { type: showSign ? type : 'neutral', showSign })}
    </Component>
  )
}

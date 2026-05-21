import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type SummaryCardProps = {
  title: string
  value: string
  description?: string
  icon?: LucideIcon
  valueClassName?: string
  trend?: React.ReactNode
}

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  valueClassName,
  trend,
}: SummaryCardProps) {
  return (
    <Card className="card-elevated transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-4 text-primary" aria-hidden />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className={cn('text-metric', valueClassName)}>{value}</p>
        {trend}
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

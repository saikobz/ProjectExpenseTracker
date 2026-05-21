import type { ReactNode } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

type ChartCardProps = {
  title: string
  description?: string
  action?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
  contentClassName?: string
}

export function ChartCard({
  title,
  description,
  action,
  footer,
  children,
  className,
  contentClassName,
}: ChartCardProps) {
  return (
    <Card className={cn('card-elevated', className)}>
      <CardHeader className={action ? 'grid-cols-[1fr_auto]' : undefined}>
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
      {footer && (
        <div className="border-t border-border/60 px-4 py-3 text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </Card>
  )
}

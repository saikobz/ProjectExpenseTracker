import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

/** Primary action in PageHeader — matches h-9 controls (e.g. MonthYearSelector). */
export function PageHeaderButton({ className, ...props }: ComponentProps<typeof Button>) {
  return <Button className={cn('h-9 shrink-0', className)} {...props} />
}

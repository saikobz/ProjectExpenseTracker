import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageToolbarProps = {
  /** Usually TabsList — stays left on desktop */
  start?: ReactNode
  /** Usually filters or primary action — stays right on desktop */
  end?: ReactNode
  className?: string
}

/** Row below PageHeader: segmented tabs (start) and optional filters (end). */
export function PageToolbar({ start, end, className }: PageToolbarProps) {
  if (!start && !end) return null

  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center',
        end ? 'sm:justify-between' : 'sm:justify-start',
        className,
      )}
    >
      {start ? <div className="flex shrink-0 items-center">{start}</div> : null}
      {end ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 sm:ml-auto">
          {end}
        </div>
      ) : null}
    </div>
  )
}

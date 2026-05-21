import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TabbedPageChromeProps = {
  title: string
  subtitle?: string
  tabs?: ReactNode
  /** Controls below tabs — stacked vertically, not split left/right */
  controls?: ReactNode
  children?: ReactNode
  className?: string
}

/** Single-column page shell: title, tabs, controls, then content in one card. */
export function TabbedPageChrome({
  title,
  subtitle,
  tabs,
  controls,
  children,
  className,
}: TabbedPageChromeProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-sm ring-1 ring-border/40',
        className,
      )}
    >
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="space-y-1">
          <h1 className="text-page-title">{title}</h1>
          {subtitle ? <p className="text-page-subtitle">{subtitle}</p> : null}
        </div>
        {tabs}
        {controls ? <div className="flex flex-col gap-3">{controls}</div> : null}
      </div>
      {children ? (
        <div className="border-t border-border/40 bg-muted/15 px-5 py-6 sm:px-6">
          {children}
        </div>
      ) : null}
    </div>
  )
}

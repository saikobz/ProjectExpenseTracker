import { LogOut, Wallet } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { mainNavItems, settingsNavItem } from '@/components/layout/nav-config'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/features/auth/useAuth'
import { cn } from '@/lib/utils'

type AppSidebarProps = {
  onNavigate?: () => void
  onLogout: () => void
  className?: string
}

function NavItemLink({
  to,
  label,
  icon: Icon,
  onNavigate,
}: {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          isActive
            ? 'border-l-2 border-primary bg-accent text-accent-foreground'
            : 'border-l-2 border-transparent text-sidebar-foreground hover:bg-muted/80 hover:text-foreground',
        )
      }
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {label}
    </NavLink>
  )
}

export function AppSidebar({ onNavigate, onLogout, className }: AppSidebarProps) {
  const { user } = useAuth()
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <aside
      className={cn(
        'flex h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar',
        className,
      )}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <Wallet className="size-5 text-primary" aria-hidden />
        </div>
        <div>
          <p className="font-semibold tracking-tight">MoneyMind</p>
          <p className="text-xs text-muted-foreground">Expense tracker</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main navigation">
        {mainNavItems.map((item) => (
          <NavItemLink key={item.to} {...item} onNavigate={onNavigate} />
        ))}
        <Separator className="my-2" />
        <NavItemLink {...settingsNavItem} onNavigate={onNavigate} />
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
          <div
            className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
            aria-hidden
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => {
            onNavigate?.()
            void onLogout()
          }}
        >
          <LogOut className="size-4" aria-hidden />
          Log out
        </Button>
      </div>
    </aside>
  )
}

import { Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/useAuth'

type MarketingLayoutProps = {
  children: ReactNode
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-muted/40 via-background to-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-lg">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="size-5 text-primary" aria-hidden />
            </div>
            <span className="text-lg font-semibold tracking-tight">MoneyMind</span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Marketing">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button>Get started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          MoneyMind &copy; {new Date().getFullYear()} — Personal expense tracking
        </div>
      </footer>
    </div>
  )
}

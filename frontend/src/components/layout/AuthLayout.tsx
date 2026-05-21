import { BarChart3, Shield, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

const highlights = [
  { icon: BarChart3, text: 'Clear dashboards and spending insights' },
  { icon: Shield, text: 'Secure sign-in with your private data' },
  { icon: Wallet, text: 'Budgets, categories, and CSV reports' },
]

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-br from-muted/30 via-background to-accent/20 lg:flex-row">
      <div className="hidden flex-1 flex-col justify-between border-r border-border/60 bg-sidebar p-10 lg:flex">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <Wallet className="size-6 text-primary" aria-hidden />
          </div>
          <span className="text-xl font-semibold tracking-tight">MoneyMind</span>
        </Link>

        <div className="max-w-md space-y-6">
          <p className="text-sm font-medium text-primary">Personal finance, simplified</p>
          <h2 className="text-3xl font-semibold tracking-tight">
            Take control of your money with confidence
          </h2>
          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4 text-primary" aria-hidden />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          Portfolio-ready expense tracker for income, spending, and budgets.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link
          to="/"
          className="mb-8 flex items-center gap-2 lg:hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-lg"
        >
          <Wallet className="size-6 text-primary" aria-hidden />
          <span className="text-xl font-semibold">MoneyMind</span>
        </Link>

        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1 text-center lg:text-left">
            <h1 className="text-page-title">{title}</h1>
            <p className="text-page-subtitle">{subtitle}</p>
          </div>

          <div className="rounded-xl bg-card p-6 shadow-lg ring-1 ring-border/50 card-elevated">
            {children}
          </div>

          <div className="text-center text-sm text-muted-foreground lg:text-left">{footer}</div>
        </div>
      </div>
    </div>
  )
}

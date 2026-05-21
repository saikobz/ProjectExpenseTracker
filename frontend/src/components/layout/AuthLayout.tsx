import { Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <Wallet className="size-6 text-primary" />
        <Link to="/" className="text-xl font-semibold tracking-tight hover:text-primary">
          MoneyMind
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
        <div className="text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  )
}

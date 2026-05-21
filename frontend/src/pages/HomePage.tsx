import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-4">
          <Wallet className="size-5 text-primary" />
          <span className="font-semibold tracking-tight">MoneyMind</span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-16">
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          <div className="space-y-3">
            <p className="text-sm font-medium text-primary">Phase 0 — Project setup</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Personal expense tracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Track income and expenses, set budgets, and understand your spending with clear
              dashboards and charts.
            </p>
          </div>

          <Card className="text-left">
            <CardHeader>
              <CardTitle>Development status</CardTitle>
              <CardDescription>
                Frontend, backend, PostgreSQL, and Prisma are configured. Authentication starts in
                Phase 1.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>React + Vite + TypeScript + Tailwind + shadcn/ui</li>
                <li>Express API with health check at /api/health</li>
                <li>PostgreSQL via Docker Compose</li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button disabled>Sign in (Phase 1)</Button>
                <Button variant="outline" disabled>
                  Register (Phase 1)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        MoneyMind &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}

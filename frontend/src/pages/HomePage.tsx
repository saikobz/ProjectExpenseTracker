import { Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/features/auth/useAuth'

export function HomePage() {
  const { isAuthenticated } = useAuth()

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
            <p className="text-sm font-medium text-primary">Personal finance, simplified</p>
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
              <CardTitle>Get started</CardTitle>
              <CardDescription>
                Create an account or sign in to access your personal dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button>Go to dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button>Sign in</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline">Register</Button>
                  </Link>
                </>
              )}
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

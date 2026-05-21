import { BarChart3, PiggyBank, Receipt } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MarketingLayout } from '@/components/layout/MarketingLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/useAuth'

const features = [
  {
    icon: Receipt,
    title: 'Track every transaction',
    description: 'Log income and expenses with categories, filters, and search.',
  },
  {
    icon: PiggyBank,
    title: 'Stay on budget',
    description: 'Set monthly limits and see usage warnings before you overspend.',
  },
  {
    icon: BarChart3,
    title: 'Reports that matter',
    description: 'Monthly and yearly insights with charts and CSV export.',
  },
]

export function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <MarketingLayout>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-primary">Personal finance, simplified</p>
          <h1 className="text-display mt-4">
            Your money, organized with clarity
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            MoneyMind helps you track spending, manage budgets, and understand your finances
            with a clean, professional dashboard built for everyday use.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg">Go to dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg">Get started free</Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Demo: demo@moneymind.app / password123
          </p>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="card-elevated transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" aria-hidden />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </section>
    </MarketingLayout>
  )
}

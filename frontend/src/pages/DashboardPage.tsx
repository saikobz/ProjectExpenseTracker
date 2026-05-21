import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/useAuth'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your financial overview</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.name}</CardTitle>
          <CardDescription>You are logged in to MoneyMind.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Email: {user?.email}</p>
          <p>Dashboard charts and transactions will be added in later phases.</p>
          <Link to="/categories">
            <Button variant="outline">Manage categories</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

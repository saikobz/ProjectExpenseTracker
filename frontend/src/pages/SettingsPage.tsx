import { Moon, Sun, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/features/auth/useAuth'
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  type ThemePreference,
} from '@/lib/theme'
import { cn } from '@/lib/utils'

const themeOptions: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function SettingsPage() {
  const { user } = useAuth()
  const [theme, setTheme] = useState<ThemePreference>(() => getStoredTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const handleTheme = (value: ThemePreference) => {
    setTheme(value)
    setStoredTheme(value)
  }

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile and app preferences."
      />

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information from MoneyMind.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div
            className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary"
            aria-hidden
          >
            {initial}
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how MoneyMind looks on your device.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Theme preference">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                type="button"
                variant={theme === value ? 'default' : 'outline'}
                className="gap-2"
                onClick={() => handleTheme(value)}
                aria-pressed={theme === value}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>App</CardTitle>
          <CardDescription>Version and demo information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>MoneyMind v0.1.0</p>
          <p>Demo account: demo@moneymind.app / password123</p>
        </CardContent>
      </Card>

      <Card className={cn('card-elevated border-danger/20')}>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Account security options.</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <Button variant="outline" disabled aria-describedby="password-help">
            Change password
          </Button>
          <p id="password-help" className="mt-2 text-xs text-muted-foreground">
            Coming soon — password changes are not available in this version.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

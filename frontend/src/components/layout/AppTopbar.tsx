import { Menu, Wallet } from 'lucide-react'
import { useState } from 'react'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/features/auth/useAuth'

type AppTopbarProps = {
  onLogout: () => void
}

export function AppTopbar({ onLogout }: AppTopbarProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/80 bg-background/95 px-4 backdrop-blur md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Open navigation menu" />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[min(100%,280px)] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <AppSidebar
            className="w-full border-0"
            onNavigate={() => setOpen(false)}
            onLogout={onLogout}
          />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <Wallet className="size-5 text-primary" aria-hidden />
        <span className="font-semibold">MoneyMind</span>
      </div>

      <div
        className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
        aria-label={`Signed in as ${user?.name}`}
      >
        {initial}
      </div>
    </header>
  )
}

import { Outlet, useNavigate } from 'react-router-dom'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppTopbar } from '@/components/layout/AppTopbar'
import { PageContainer } from '@/components/common/PageContainer'
import { useAuth } from '@/features/auth/useAuth'

export function AppShell() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-svh bg-surface">
      <div className="hidden md:flex">
        <AppSidebar onLogout={() => void handleLogout()} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar onLogout={() => void handleLogout()} />
        <main className="flex-1">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
      </div>
    </div>
  )
}

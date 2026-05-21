import {
  ArrowLeftRight,
  FileBarChart,
  FolderOpen,
  LayoutDashboard,
  PiggyBank,
  Settings,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

export const mainNavItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/categories', label: 'Categories', icon: FolderOpen },
]

export const settingsNavItem: NavItem = {
  to: '/settings',
  label: 'Settings',
  icon: Settings,
}

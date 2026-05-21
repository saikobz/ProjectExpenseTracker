import type { BudgetStatus } from '../types/budget.js'

export function computeBudgetUsage(spent: number, amount: number) {
  const usagePercentage = amount > 0 ? Math.round((spent / amount) * 1000) / 10 : 0
  const remaining = Math.round((amount - spent) * 100) / 100

  let status: BudgetStatus = 'normal'
  if (usagePercentage > 100) {
    status = 'over_budget'
  } else if (usagePercentage >= 80) {
    status = 'warning'
  }

  return { usagePercentage, remaining, status }
}

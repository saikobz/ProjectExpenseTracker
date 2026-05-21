export type BudgetStatus = 'normal' | 'warning' | 'over_budget'

export type BudgetWithUsageDto = {
  id: string
  categoryId: string
  categoryName: string
  categoryColor: string | null
  month: number
  year: number
  amount: number
  spent: number
  remaining: number
  usagePercentage: number
  status: BudgetStatus
}

export type BudgetDto = {
  id: string
  categoryId: string
  categoryName: string
  categoryColor: string | null
  month: number
  year: number
  amount: number
  createdAt: string
  updatedAt: string
}

export type BudgetStatus = 'normal' | 'warning' | 'over_budget'

export type BudgetWithUsage = {
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

export type Budget = {
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

export type BudgetPeriod = {
  month: number
  year: number
}

export type CreateBudgetInput = {
  categoryId: string
  month: number
  year: number
  amount: number
}

export type UpdateBudgetInput = Partial<CreateBudgetInput>

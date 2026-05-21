export type DashboardSummary = {
  totalIncome: number
  totalExpense: number
  balance: number
  topExpenseCategory: {
    categoryId: string
    categoryName: string
    color: string | null
    amount: number
  } | null
  transactionCount: number
}

export type CategoryExpenseItem = {
  categoryId: string
  categoryName: string
  color: string | null
  amount: number
  percentage: number
}

export type MonthlyTrendItem = {
  month: number
  income: number
  expense: number
}

export type RecentTransactionItem = {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string | null
  transactionDate: string
  paymentMethod: string | null
  category: {
    id: string
    name: string
    type: 'income' | 'expense'
    color: string | null
  }
}

export type DashboardPeriod = {
  month: number
  year: number
}

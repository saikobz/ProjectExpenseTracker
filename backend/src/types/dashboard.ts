export type DashboardSummaryDto = {
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

export type CategoryExpenseDto = {
  categoryId: string
  categoryName: string
  color: string | null
  amount: number
  percentage: number
}

export type MonthlyTrendItemDto = {
  month: number
  income: number
  expense: number
}

export type RecentTransactionDto = {
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

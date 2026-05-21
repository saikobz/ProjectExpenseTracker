import type { CategoryExpenseDto } from './dashboard.js'

export type ReportTransactionDto = {
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

export type MonthlyReportDto = {
  totalIncome: number
  totalExpense: number
  balance: number
  incomeByCategory: CategoryExpenseDto[]
  expenseByCategory: CategoryExpenseDto[]
  transactionCount: number
  currentMonthExpense: number
  previousMonthExpense: number
  expenseChangeAmount: number
  expenseChangePercentage: number
  topExpenseCategory: {
    categoryId: string
    categoryName: string
    color: string | null
    amount: number
  } | null
  transactions: ReportTransactionDto[]
}

export type MonthlyBreakdownItem = {
  month: number
  income: number
  expense: number
}

export type YearlyCategoryBreakdownItem = {
  categoryId: string
  categoryName: string
  color: string | null
  type: 'income' | 'expense'
  amount: number
  percentage: number
}

export type YearlyReportDto = {
  totalIncome: number
  totalExpense: number
  balance: number
  monthlyBreakdown: MonthlyBreakdownItem[]
  categoryBreakdown: YearlyCategoryBreakdownItem[]
  highestExpenseMonth: { month: number; amount: number } | null
  lowestExpenseMonth: { month: number; amount: number } | null
}

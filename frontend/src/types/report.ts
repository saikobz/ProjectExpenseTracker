export type CategoryBreakdownItem = {
  categoryId: string
  categoryName: string
  color: string | null
  amount: number
  percentage: number
}

export type ReportTransaction = {
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

export type MonthlyReport = {
  totalIncome: number
  totalExpense: number
  balance: number
  incomeByCategory: CategoryBreakdownItem[]
  expenseByCategory: CategoryBreakdownItem[]
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
  transactions: ReportTransaction[]
}

export type YearlyCategoryItem = CategoryBreakdownItem & {
  type: 'income' | 'expense'
}

export type MonthlyReportPeriod = {
  month: number
  year: number
}

export type YearlyReport = {
  totalIncome: number
  totalExpense: number
  balance: number
  monthlyBreakdown: { month: number; income: number; expense: number }[]
  categoryBreakdown: YearlyCategoryItem[]
  highestExpenseMonth: { month: number; amount: number } | null
  lowestExpenseMonth: { month: number; amount: number } | null
}

export type CsvExportParams = {
  from: string
  to: string
  type?: 'income' | 'expense'
  categoryId?: string
}

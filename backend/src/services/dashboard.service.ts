import { dashboardRepository, getMonthDateRange } from '../repositories/dashboard.repository.js'
import type {
  CategoryExpenseDto,
  DashboardSummaryDto,
  MonthlyTrendItemDto,
  RecentTransactionDto,
} from '../types/dashboard.js'
import { decimalToNumber } from '../utils/decimal.js'
import { formatDateOnly } from '../utils/date.js'
import { resolveMonthYear } from '../utils/period.js'
import type {
  DashboardMonthYearQuery,
  DashboardRecentQuery,
  DashboardYearQuery,
} from '../validations/dashboard.validation.js'

export const dashboardService = {
  async getSummary(userId: string, query: DashboardMonthYearQuery): Promise<DashboardSummaryDto> {
    const { month, year } = resolveMonthYear(query)
    const dateRange = getMonthDateRange(year, month)

    const [totalIncome, totalExpense, transactionCount, topExpenseCategory] = await Promise.all([
      dashboardRepository.sumByType(userId, 'income', dateRange),
      dashboardRepository.sumByType(userId, 'expense', dateRange),
      dashboardRepository.countInRange(userId, dateRange),
      dashboardRepository.topExpenseCategory(userId, dateRange),
    ])

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      topExpenseCategory,
      transactionCount,
    }
  },

  async getCategoryExpenses(
    userId: string,
    query: DashboardMonthYearQuery,
  ): Promise<CategoryExpenseDto[]> {
    const { month, year } = resolveMonthYear(query)
    const dateRange = getMonthDateRange(year, month)
    const groups = await dashboardRepository.expenseByCategory(userId, dateRange)

    const totalExpense = groups.reduce((sum, item) => sum + item.amount, 0)
    if (totalExpense === 0) return []

    return groups.map((item) => ({
      ...item,
      percentage: Math.round((item.amount / totalExpense) * 1000) / 10,
    }))
  },

  async getMonthlyTrend(
    userId: string,
    query: DashboardYearQuery,
  ): Promise<MonthlyTrendItemDto[]> {
    const year = query.year ?? new Date().getUTCFullYear()
    const transactions = await dashboardRepository.transactionsForYear(userId, year)

    const byMonth = new Map<number, { income: number; expense: number }>()
    for (let m = 1; m <= 12; m++) {
      byMonth.set(m, { income: 0, expense: 0 })
    }

    for (const tx of transactions) {
      const month = tx.transactionDate.getUTCMonth() + 1
      const entry = byMonth.get(month)!
      const amount = decimalToNumber(tx.amount)
      if (tx.type === 'income') {
        entry.income += amount
      } else {
        entry.expense += amount
      }
    }

    return Array.from(byMonth.entries())
      .sort(([a], [b]) => a - b)
      .map(([month, values]) => ({
        month,
        income: values.income,
        expense: values.expense,
      }))
  },

  async getRecentTransactions(
    userId: string,
    query: DashboardRecentQuery,
  ): Promise<RecentTransactionDto[]> {
    const transactions = await dashboardRepository.recentTransactions(userId, query.limit)

    return transactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      amount: decimalToNumber(tx.amount),
      description: tx.description,
      transactionDate: formatDateOnly(tx.transactionDate),
      paymentMethod: tx.paymentMethod,
      category: {
        id: tx.category.id,
        name: tx.category.name,
        type: tx.category.type,
        color: tx.category.color,
      },
    }))
  },
}

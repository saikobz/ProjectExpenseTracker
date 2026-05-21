import { reportRepository } from '../repositories/report.repository.js'
import { getMonthDateRange } from '../repositories/dashboard.repository.js'
import type {
  MonthlyReportDto,
  ReportTransactionDto,
  YearlyReportDto,
} from '../types/report.js'
import { decimalToNumber } from '../utils/decimal.js'
import { formatDateOnly } from '../utils/date.js'
import { resolveMonthYear } from '../utils/period.js'
import type {
  ReportExportCsvQuery,
  ReportMonthYearQuery,
  ReportYearQuery,
} from '../validations/report.validation.js'

function getPreviousMonth(month: number, year: number) {
  if (month === 1) {
    return { month: 12, year: year - 1 }
  }
  return { month: month - 1, year }
}

function addPercentages<T extends { amount: number }>(items: T[]): (T & { percentage: number })[] {
  const total = items.reduce((sum, item) => sum + item.amount, 0)
  if (total === 0) return items.map((item) => ({ ...item, percentage: 0 }))
  return items.map((item) => ({
    ...item,
    percentage: Math.round((item.amount / total) * 1000) / 10,
  }))
}

function toReportTransaction(tx: {
  id: string
  type: 'income' | 'expense'
  amount: { toString(): string } | number
  description: string | null
  transactionDate: Date
  paymentMethod: string | null
  category: {
    id: string
    name: string
    type: 'income' | 'expense'
    color: string | null
  }
}): ReportTransactionDto {
  return {
    id: tx.id,
    type: tx.type,
    amount: decimalToNumber(tx.amount),
    description: tx.description,
    transactionDate: formatDateOnly(tx.transactionDate),
    paymentMethod: tx.paymentMethod,
    category: tx.category,
  }
}

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export const reportService = {
  async getMonthlyReport(userId: string, query: ReportMonthYearQuery): Promise<MonthlyReportDto> {
    const { month, year } = resolveMonthYear(query)
    const dateRange = getMonthDateRange(year, month)
    const prev = getPreviousMonth(month, year)
    const prevRange = getMonthDateRange(prev.year, prev.month)

    const [
      totalIncome,
      totalExpense,
      transactionCount,
      topExpenseCategory,
      incomeGroups,
      expenseGroups,
      transactions,
      previousMonthExpense,
    ] = await Promise.all([
      reportRepository.sumByType(userId, 'income', dateRange),
      reportRepository.sumByType(userId, 'expense', dateRange),
      reportRepository.countInRange(userId, dateRange),
      reportRepository.topExpenseCategory(userId, dateRange),
      reportRepository.incomeByCategory(userId, dateRange),
      reportRepository.expenseByCategory(userId, dateRange),
      reportRepository.transactionsInRange(userId, year, month),
      reportRepository.sumByType(userId, 'expense', prevRange),
    ])

    const expenseChangeAmount = totalExpense - previousMonthExpense
    const expenseChangePercentage =
      previousMonthExpense > 0
        ? Math.round((expenseChangeAmount / previousMonthExpense) * 1000) / 10
        : totalExpense > 0
          ? 100
          : 0

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeByCategory: addPercentages(incomeGroups),
      expenseByCategory: addPercentages(expenseGroups),
      transactionCount,
      currentMonthExpense: totalExpense,
      previousMonthExpense,
      expenseChangeAmount,
      expenseChangePercentage,
      topExpenseCategory,
      transactions: transactions.map(toReportTransaction),
    }
  },

  async getYearlyReport(userId: string, query: ReportYearQuery): Promise<YearlyReportDto> {
    const year = query.year ?? new Date().getUTCFullYear()
    const yearRange = getMonthDateRange(year, 1)
    const yearEndRange = getMonthDateRange(year, 12)
    const fullYearRange = { gte: yearRange.gte, lte: yearEndRange.lte }

    const [totalIncome, totalExpense, yearTransactions, categoryGroups] = await Promise.all([
      reportRepository.sumByType(userId, 'income', fullYearRange),
      reportRepository.sumByType(userId, 'expense', fullYearRange),
      reportRepository.transactionsForYear(userId, year),
      reportRepository.categoryBreakdownForYear(userId, year),
    ])

    const byMonth = new Map<number, { income: number; expense: number }>()
    for (let m = 1; m <= 12; m++) {
      byMonth.set(m, { income: 0, expense: 0 })
    }

    for (const tx of yearTransactions) {
      const m = tx.transactionDate.getUTCMonth() + 1
      const entry = byMonth.get(m)!
      const amount = decimalToNumber(tx.amount)
      if (tx.type === 'income') {
        entry.income += amount
      } else {
        entry.expense += amount
      }
    }

    const monthlyBreakdown = Array.from(byMonth.entries())
      .sort(([a], [b]) => a - b)
      .map(([month, values]) => ({
        month,
        income: values.income,
        expense: values.expense,
      }))

    const expenseMonths = monthlyBreakdown.filter((m) => m.expense > 0)
    const highestExpenseMonth =
      expenseMonths.length > 0
        ? expenseMonths.reduce((max, m) => (m.expense > max.expense ? m : max))
        : null
    const lowestExpenseMonth =
      expenseMonths.length > 0
        ? expenseMonths.reduce((min, m) => (m.expense < min.expense ? m : min))
        : null

    const totalByType = categoryGroups.reduce(
      (acc, item) => {
        acc[item.type] += item.amount
        return acc
      },
      { income: 0, expense: 0 },
    )

    const categoryBreakdown = categoryGroups
      .map((item) => {
        const typeTotal = totalByType[item.type]
        return {
          ...item,
          percentage:
            typeTotal > 0 ? Math.round((item.amount / typeTotal) * 1000) / 10 : 0,
        }
      })
      .sort((a, b) => b.amount - a.amount)

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      monthlyBreakdown,
      categoryBreakdown,
      highestExpenseMonth: highestExpenseMonth
        ? { month: highestExpenseMonth.month, amount: highestExpenseMonth.expense }
        : null,
      lowestExpenseMonth: lowestExpenseMonth
        ? { month: lowestExpenseMonth.month, amount: lowestExpenseMonth.expense }
        : null,
    }
  },

  async exportCsv(userId: string, query: ReportExportCsvQuery): Promise<string> {
    const transactions = await reportRepository.transactionsForExport(userId, query)

    const header = ['date', 'type', 'category', 'amount', 'description', 'paymentMethod']
    const rows = transactions.map((tx) => [
      formatDateOnly(tx.transactionDate),
      tx.type,
      tx.category.name,
      decimalToNumber(tx.amount).toFixed(2),
      tx.description ?? '',
      tx.paymentMethod ?? '',
    ])

    const csvBody = [header, ...rows]
      .map((row) => row.map((cell) => escapeCsvField(String(cell))).join(','))
      .join('\n')

    // UTF-8 BOM so Excel on Windows detects Thai/Unicode correctly
    return `\uFEFF${csvBody}`
  },
}

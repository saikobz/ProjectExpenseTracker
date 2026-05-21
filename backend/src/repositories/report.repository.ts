import { prisma } from '../lib/prisma.js'
import {
  dashboardRepository,
  getMonthDateRange,
  getYearDateRange,
} from './dashboard.repository.js'

const categorySelect = {
  id: true,
  name: true,
  type: true,
  color: true,
} as const

export const reportRepository = {
  sumByType: dashboardRepository.sumByType,
  countInRange: dashboardRepository.countInRange,
  topExpenseCategory: dashboardRepository.topExpenseCategory,
  expenseByCategory: dashboardRepository.expenseByCategory,
  transactionsForYear: dashboardRepository.transactionsForYear,

  async incomeByCategory(userId: string, transactionDate: { gte: Date; lte: Date }) {
    const groups = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, type: 'income', transactionDate },
      _sum: { amount: true },
    })

    if (groups.length === 0) return []

    const categories = await prisma.category.findMany({
      where: { id: { in: groups.map((g) => g.categoryId) }, userId },
      select: categorySelect,
    })
    const categoryMap = new Map(categories.map((c) => [c.id, c]))

    return groups
      .map((g) => {
        const category = categoryMap.get(g.categoryId)
        if (!category) return null
        const amount = Number(g._sum.amount?.toString() ?? '0')
        return {
          categoryId: category.id,
          categoryName: category.name,
          color: category.color,
          amount,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.amount - a.amount)
  },

  async transactionsInRange(userId: string, year: number, month: number) {
    return prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: getMonthDateRange(year, month),
      },
      include: { category: { select: categorySelect } },
      orderBy: [{ transactionDate: 'desc' }, { createdAt: 'desc' }],
    })
  },

  async transactionsForExport(
    userId: string,
    filters: {
      from: string
      to: string
      type?: 'income' | 'expense'
      categoryId?: string
    },
  ) {
    return prisma.transaction.findMany({
      where: {
        userId,
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
        transactionDate: {
          gte: new Date(`${filters.from}T00:00:00.000Z`),
          lte: new Date(`${filters.to}T23:59:59.999Z`),
        },
      },
      include: { category: { select: categorySelect } },
      orderBy: [{ transactionDate: 'desc' }, { createdAt: 'desc' }],
    })
  },

  async categoryBreakdownForYear(userId: string, year: number) {
    const groups = await prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      where: {
        userId,
        transactionDate: getYearDateRange(year),
      },
      _sum: { amount: true },
    })

    if (groups.length === 0) return []

    const categoryIds = [...new Set(groups.map((g) => g.categoryId))]
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds }, userId },
      select: categorySelect,
    })
    const categoryMap = new Map(categories.map((c) => [c.id, c]))

    return groups
      .map((g) => {
        const category = categoryMap.get(g.categoryId)
        if (!category) return null
        return {
          categoryId: category.id,
          categoryName: category.name,
          color: category.color,
          type: g.type as 'income' | 'expense',
          amount: Number(g._sum.amount?.toString() ?? '0'),
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  },
}

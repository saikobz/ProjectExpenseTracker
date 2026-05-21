import type { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

const categorySelect = {
  id: true,
  name: true,
  type: true,
  color: true,
} as const

export function getMonthDateRange(year: number, month: number) {
  const monthStr = String(month).padStart(2, '0')
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const dayStr = String(lastDay).padStart(2, '0')

  return {
    gte: new Date(`${year}-${monthStr}-01T00:00:00.000Z`),
    lte: new Date(`${year}-${monthStr}-${dayStr}T23:59:59.999Z`),
  }
}

export function getYearDateRange(year: number) {
  return {
    gte: new Date(`${year}-01-01T00:00:00.000Z`),
    lte: new Date(`${year}-12-31T23:59:59.999Z`),
  }
}

function decimalToNumber(value: { toString(): string } | number | null | undefined): number {
  if (value == null) return 0
  return typeof value === 'number' ? value : Number(value.toString())
}

export const dashboardRepository = {
  async sumByType(
    userId: string,
    type: 'income' | 'expense',
    transactionDate: Prisma.DateTimeFilter,
  ): Promise<number> {
    const result = await prisma.transaction.aggregate({
      where: { userId, type, transactionDate },
      _sum: { amount: true },
    })
    return decimalToNumber(result._sum.amount)
  },

  async countInRange(
    userId: string,
    transactionDate: Prisma.DateTimeFilter,
  ): Promise<number> {
    return prisma.transaction.count({ where: { userId, transactionDate } })
  },

  async topExpenseCategory(
    userId: string,
    transactionDate: Prisma.DateTimeFilter,
  ) {
    const groups = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, type: 'expense', transactionDate },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 1,
    })

    if (groups.length === 0) return null

    const top = groups[0]
    const category = await prisma.category.findFirst({
      where: { id: top.categoryId, userId },
      select: categorySelect,
    })

    if (!category) return null

    return {
      categoryId: category.id,
      categoryName: category.name,
      color: category.color,
      amount: decimalToNumber(top._sum.amount),
    }
  },

  async expenseByCategory(userId: string, transactionDate: Prisma.DateTimeFilter) {
    const groups = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, type: 'expense', transactionDate },
      _sum: { amount: true },
    })

    if (groups.length === 0) return []

    const categoryIds = groups.map((g) => g.categoryId)
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
          amount: decimalToNumber(g._sum.amount),
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.amount - a.amount)
  },

  async transactionsForYear(userId: string, year: number) {
    return prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: getYearDateRange(year),
      },
      select: {
        transactionDate: true,
        type: true,
        amount: true,
      },
    })
  },

  async recentTransactions(userId: string, limit: number) {
    return prisma.transaction.findMany({
      where: { userId },
      include: { category: { select: categorySelect } },
      orderBy: [{ transactionDate: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    })
  },
}

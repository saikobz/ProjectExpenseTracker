import type { Budget, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { decimalToNumber } from '../utils/decimal.js'
import { getMonthDateRange } from './dashboard.repository.js'

const categorySelect = {
  id: true,
  name: true,
  type: true,
  color: true,
} as const

export type BudgetWithCategory = Budget & {
  category: {
    id: string
    name: string
    type: 'income' | 'expense'
    color: string | null
  }
}

export const budgetRepository = {
  findManyByUserMonthYear(
    userId: string,
    month: number,
    year: number,
  ): Promise<BudgetWithCategory[]> {
    return prisma.budget.findMany({
      where: { userId, month, year },
      include: { category: { select: categorySelect } },
      orderBy: { category: { name: 'asc' } },
    })
  },

  findByIdForUser(id: string, userId: string): Promise<BudgetWithCategory | null> {
    return prisma.budget.findFirst({
      where: { id, userId },
      include: { category: { select: categorySelect } },
    })
  },

  findByUnique(
    userId: string,
    categoryId: string,
    month: number,
    year: number,
    excludeId?: string,
  ): Promise<Budget | null> {
    return prisma.budget.findFirst({
      where: {
        userId,
        categoryId,
        month,
        year,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    })
  },

  create(data: Prisma.BudgetCreateInput): Promise<BudgetWithCategory> {
    return prisma.budget.create({
      data,
      include: { category: { select: categorySelect } },
    })
  },

  update(id: string, data: Prisma.BudgetUpdateInput): Promise<BudgetWithCategory> {
    return prisma.budget.update({
      where: { id },
      data,
      include: { category: { select: categorySelect } },
    })
  },

  delete(id: string): Promise<Budget> {
    return prisma.budget.delete({ where: { id } })
  },

  async expenseSpentByCategory(
    userId: string,
    month: number,
    year: number,
  ): Promise<Map<string, number>> {
    const dateRange = getMonthDateRange(year, month)
    const groups = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: 'expense',
        transactionDate: dateRange,
      },
      _sum: { amount: true },
    })

    return new Map(
      groups.map((g) => [g.categoryId, decimalToNumber(g._sum.amount)]),
    )
  },
}

import type { CategoryType, Prisma, Transaction } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import type { TransactionListQueryInput } from '../validations/transaction.validation.js'

const categorySelect = {
  id: true,
  name: true,
  type: true,
  color: true,
} as const

export type TransactionWithCategory = Transaction & {
  category: {
    id: string
    name: string
    type: CategoryType
    color: string | null
  }
}

function buildWhere(userId: string, query: TransactionListQueryInput): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = { userId }

  if (query.type) {
    where.type = query.type
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId
  }

  if (query.from || query.to) {
    where.transactionDate = {}
    if (query.from) {
      where.transactionDate.gte = new Date(`${query.from}T00:00:00.000Z`)
    }
    if (query.to) {
      where.transactionDate.lte = new Date(`${query.to}T23:59:59.999Z`)
    }
  }

  if (query.search) {
    where.description = {
      contains: query.search,
      mode: 'insensitive',
    }
  }

  return where
}

function buildOrderBy(
  query: TransactionListQueryInput,
): Prisma.TransactionOrderByWithRelationInput {
  const direction = query.sortOrder
  if (query.sortBy === 'amount') {
    return { amount: direction }
  }
  return { transactionDate: direction }
}

export const transactionRepository = {
  findManyPaginated(
    userId: string,
    query: TransactionListQueryInput,
  ): Promise<{ items: TransactionWithCategory[]; total: number }> {
    const where = buildWhere(userId, query)
    const skip = (query.page - 1) * query.limit

    return Promise.all([
      prisma.transaction.findMany({
        where,
        include: { category: { select: categorySelect } },
        orderBy: buildOrderBy(query),
        skip,
        take: query.limit,
      }),
      prisma.transaction.count({ where }),
    ]).then(([items, total]) => ({ items, total }))
  },

  findByIdForUser(id: string, userId: string): Promise<TransactionWithCategory | null> {
    return prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: { select: categorySelect } },
    })
  },

  create(data: Prisma.TransactionCreateInput): Promise<TransactionWithCategory> {
    return prisma.transaction.create({
      data,
      include: { category: { select: categorySelect } },
    })
  },

  update(id: string, data: Prisma.TransactionUpdateInput): Promise<TransactionWithCategory> {
    return prisma.transaction.update({
      where: { id },
      data,
      include: { category: { select: categorySelect } },
    })
  },

  delete(id: string): Promise<Transaction> {
    return prisma.transaction.delete({ where: { id } })
  },
}

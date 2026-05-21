import type { CategoryType } from '@prisma/client'
import { AppError } from '../middlewares/error.middleware.js'
import { categoryRepository } from '../repositories/category.repository.js'
import {
  transactionRepository,
  type TransactionWithCategory,
} from '../repositories/transaction.repository.js'
import type { PaginatedTransactionsDto, TransactionDto } from '../types/transaction.js'
import type {
  CreateTransactionInput,
  TransactionListQueryInput,
  UpdateTransactionInput,
} from '../validations/transaction.validation.js'
import { decimalToNumber } from '../utils/decimal.js'
import { formatDateOnly } from '../utils/date.js'

function toTransactionDto(transaction: TransactionWithCategory): TransactionDto {
  return {
    id: transaction.id,
    type: transaction.type,
    categoryId: transaction.categoryId,
    amount: decimalToNumber(transaction.amount),
    description: transaction.description,
    transactionDate: formatDateOnly(transaction.transactionDate),
    paymentMethod: transaction.paymentMethod,
    category: {
      id: transaction.category.id,
      name: transaction.category.name,
      type: transaction.category.type,
      color: transaction.category.color,
    },
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  }
}

async function assertCategoryForTransaction(
  userId: string,
  categoryId: string,
  type: CategoryType,
): Promise<void> {
  const category = await categoryRepository.findByIdForUser(categoryId, userId)
  if (!category) {
    throw new AppError(400, 'Category not found or does not belong to you')
  }
  if (category.type !== type) {
    throw new AppError(400, 'Category type does not match transaction type')
  }
}

export const transactionService = {
  async list(
    userId: string,
    query: TransactionListQueryInput,
  ): Promise<PaginatedTransactionsDto> {
    const { items, total } = await transactionRepository.findManyPaginated(userId, query)
    const totalPages = Math.max(1, Math.ceil(total / query.limit))

    return {
      items: items.map(toTransactionDto),
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    }
  },

  async getById(userId: string, transactionId: string): Promise<TransactionDto> {
    const transaction = await transactionRepository.findByIdForUser(transactionId, userId)
    if (!transaction) {
      throw new AppError(404, 'Transaction not found')
    }
    return toTransactionDto(transaction)
  },

  async create(userId: string, input: CreateTransactionInput): Promise<TransactionDto> {
    await assertCategoryForTransaction(userId, input.categoryId, input.type)

    const transaction = await transactionRepository.create({
      type: input.type,
      amount: input.amount,
      description: input.description ?? null,
      transactionDate: new Date(`${input.transactionDate}T12:00:00.000Z`),
      paymentMethod: input.paymentMethod ?? null,
      user: { connect: { id: userId } },
      category: { connect: { id: input.categoryId } },
    })

    return toTransactionDto(transaction)
  },

  async update(
    userId: string,
    transactionId: string,
    input: UpdateTransactionInput,
  ): Promise<TransactionDto> {
    const existing = await transactionRepository.findByIdForUser(transactionId, userId)
    if (!existing) {
      throw new AppError(404, 'Transaction not found')
    }

    const nextType = input.type ?? existing.type
    const nextCategoryId = input.categoryId ?? existing.categoryId

    await assertCategoryForTransaction(userId, nextCategoryId, nextType)

    const transaction = await transactionRepository.update(transactionId, {
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.categoryId !== undefined ? { category: { connect: { id: input.categoryId } } } : {}),
      ...(input.amount !== undefined ? { amount: input.amount } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.transactionDate !== undefined
        ? { transactionDate: new Date(`${input.transactionDate}T12:00:00.000Z`) }
        : {}),
      ...(input.paymentMethod !== undefined ? { paymentMethod: input.paymentMethod } : {}),
    })

    return toTransactionDto(transaction)
  },

  async delete(userId: string, transactionId: string): Promise<void> {
    const existing = await transactionRepository.findByIdForUser(transactionId, userId)
    if (!existing) {
      throw new AppError(404, 'Transaction not found')
    }

    await transactionRepository.delete(transactionId)
  },
}

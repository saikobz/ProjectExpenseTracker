import { AppError } from '../middlewares/error.middleware.js'
import { categoryRepository } from '../repositories/category.repository.js'
import { budgetRepository } from '../repositories/budget.repository.js'
import type { BudgetDto, BudgetStatus, BudgetWithUsageDto } from '../types/budget.js'
import type {
  BudgetListQuery,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '../validations/budget.validation.js'

function resolveMonthYear(query: BudgetListQuery) {
  const now = new Date()
  return {
    month: query.month ?? now.getUTCMonth() + 1,
    year: query.year ?? now.getUTCFullYear(),
  }
}

function decimalToNumber(value: { toString(): string } | number): number {
  return typeof value === 'number' ? value : Number(value.toString())
}

function computeUsage(spent: number, amount: number) {
  const usagePercentage = amount > 0 ? Math.round((spent / amount) * 1000) / 10 : 0
  const remaining = Math.round((amount - spent) * 100) / 100

  let status: BudgetStatus = 'normal'
  if (usagePercentage > 100) {
    status = 'over_budget'
  } else if (usagePercentage >= 80) {
    status = 'warning'
  }

  return { usagePercentage, remaining, status }
}

function toBudgetWithUsage(
  budget: {
    id: string
    categoryId: string
    month: number
    year: number
    amount: { toString(): string } | number
    category: { name: string; color: string | null }
  },
  spent: number,
): BudgetWithUsageDto {
  const amount = decimalToNumber(budget.amount)
  const { usagePercentage, remaining, status } = computeUsage(spent, amount)

  return {
    id: budget.id,
    categoryId: budget.categoryId,
    categoryName: budget.category.name,
    categoryColor: budget.category.color,
    month: budget.month,
    year: budget.year,
    amount,
    spent,
    remaining,
    usagePercentage,
    status,
  }
}

function toBudgetDto(budget: {
  id: string
  categoryId: string
  month: number
  year: number
  amount: { toString(): string } | number
  category: { name: string; color: string | null }
  createdAt: Date
  updatedAt: Date
}): BudgetDto {
  return {
    id: budget.id,
    categoryId: budget.categoryId,
    categoryName: budget.category.name,
    categoryColor: budget.category.color,
    month: budget.month,
    year: budget.year,
    amount: decimalToNumber(budget.amount),
    createdAt: budget.createdAt.toISOString(),
    updatedAt: budget.updatedAt.toISOString(),
  }
}

async function assertExpenseCategory(userId: string, categoryId: string) {
  const category = await categoryRepository.findByIdForUser(categoryId, userId)
  if (!category) {
    throw new AppError(400, 'Category not found or does not belong to you')
  }
  if (category.type !== 'expense') {
    throw new AppError(400, 'Budget can only be set for expense categories')
  }
  return category
}

export const budgetService = {
  async list(userId: string, query: BudgetListQuery): Promise<BudgetWithUsageDto[]> {
    const { month, year } = resolveMonthYear(query)
    const [budgets, spentMap] = await Promise.all([
      budgetRepository.findManyByUserMonthYear(userId, month, year),
      budgetRepository.expenseSpentByCategory(userId, month, year),
    ])

    return budgets.map((budget) =>
      toBudgetWithUsage(budget, spentMap.get(budget.categoryId) ?? 0),
    )
  },

  async create(userId: string, input: CreateBudgetInput): Promise<BudgetDto> {
    await assertExpenseCategory(userId, input.categoryId)

    const duplicate = await budgetRepository.findByUnique(
      userId,
      input.categoryId,
      input.month,
      input.year,
    )
    if (duplicate) {
      throw new AppError(409, 'Budget already exists for this category and month')
    }

    const budget = await budgetRepository.create({
      month: input.month,
      year: input.year,
      amount: input.amount,
      user: { connect: { id: userId } },
      category: { connect: { id: input.categoryId } },
    })

    return toBudgetDto(budget)
  },

  async update(
    userId: string,
    budgetId: string,
    input: UpdateBudgetInput,
  ): Promise<BudgetDto> {
    const existing = await budgetRepository.findByIdForUser(budgetId, userId)
    if (!existing) {
      throw new AppError(404, 'Budget not found')
    }

    const nextCategoryId = input.categoryId ?? existing.categoryId
    const nextMonth = input.month ?? existing.month
    const nextYear = input.year ?? existing.year

    await assertExpenseCategory(userId, nextCategoryId)

    const duplicate = await budgetRepository.findByUnique(
      userId,
      nextCategoryId,
      nextMonth,
      nextYear,
      budgetId,
    )
    if (duplicate) {
      throw new AppError(409, 'Budget already exists for this category and month')
    }

    const budget = await budgetRepository.update(budgetId, {
      ...(input.categoryId !== undefined
        ? { category: { connect: { id: input.categoryId } } }
        : {}),
      ...(input.month !== undefined ? { month: input.month } : {}),
      ...(input.year !== undefined ? { year: input.year } : {}),
      ...(input.amount !== undefined ? { amount: input.amount } : {}),
    })

    return toBudgetDto(budget)
  },

  async delete(userId: string, budgetId: string): Promise<void> {
    const existing = await budgetRepository.findByIdForUser(budgetId, userId)
    if (!existing) {
      throw new AppError(404, 'Budget not found')
    }

    await budgetRepository.delete(budgetId)
  },
}

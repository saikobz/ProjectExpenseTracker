import type { CategoryType } from '@prisma/client'

export type DefaultCategorySeed = {
  name: string
  type: CategoryType
  color: string
}

export const DEFAULT_EXPENSE_CATEGORIES: DefaultCategorySeed[] = [
  { name: 'Food', type: 'expense', color: '#EF4444' },
  { name: 'Transportation', type: 'expense', color: '#F97316' },
  { name: 'Shopping', type: 'expense', color: '#EC4899' },
  { name: 'Rent', type: 'expense', color: '#8B5CF6' },
  { name: 'Utilities', type: 'expense', color: '#6366F1' },
  { name: 'Health', type: 'expense', color: '#14B8A6' },
  { name: 'Entertainment', type: 'expense', color: '#EAB308' },
  { name: 'Education', type: 'expense', color: '#3B82F6' },
  { name: 'Others', type: 'expense', color: '#6B7280' },
]

export const DEFAULT_INCOME_CATEGORIES: DefaultCategorySeed[] = [
  { name: 'Salary', type: 'income', color: '#22C55E' },
  { name: 'Freelance', type: 'income', color: '#10B981' },
  { name: 'Investment', type: 'income', color: '#06B6D4' },
  { name: 'Bonus', type: 'income', color: '#84CC16' },
  { name: 'Gift', type: 'income', color: '#A855F7' },
  { name: 'Others', type: 'income', color: '#6B7280' },
]

export const ALL_DEFAULT_CATEGORIES: DefaultCategorySeed[] = [
  ...DEFAULT_EXPENSE_CATEGORIES,
  ...DEFAULT_INCOME_CATEGORIES,
]

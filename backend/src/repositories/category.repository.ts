import type { Category, CategoryType, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import type { DefaultCategorySeed } from '../constants/defaultCategories.js'

export const categoryRepository = {
  findManyByUser(userId: string, type?: CategoryType): Promise<Category[]> {
    const where: Prisma.CategoryWhereInput = { userId }
    if (type) {
      where.type = type
    }

    return prisma.category.findMany({
      where,
      orderBy: [{ name: 'asc' }],
    })
  },

  findByIdForUser(id: string, userId: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { id, userId },
    })
  },

  findByNameForUser(
    userId: string,
    name: string,
    type: CategoryType,
    excludeId?: string,
  ): Promise<Category | null> {
    return prisma.category.findFirst({
      where: {
        userId,
        name,
        type,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    })
  },

  create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data })
  },

  createManyDefaults(userId: string, seeds: DefaultCategorySeed[]): Promise<number> {
    return prisma.category
      .createMany({
        data: seeds.map((seed) => ({
          userId,
          name: seed.name,
          type: seed.type,
          color: seed.color,
        })),
        skipDuplicates: true,
      })
      .then((result) => result.count)
  },

  update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({ where: { id }, data })
  },

  delete(id: string): Promise<Category> {
    return prisma.category.delete({ where: { id } })
  },
}

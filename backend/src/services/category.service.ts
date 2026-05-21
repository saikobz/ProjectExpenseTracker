import { Prisma } from '@prisma/client'
import { ALL_DEFAULT_CATEGORIES } from '../constants/defaultCategories.js'
import { AppError } from '../middlewares/error.middleware.js'
import { categoryRepository } from '../repositories/category.repository.js'
import type { CategoryDto } from '../types/category.js'
import type {
  CategoryQueryInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../validations/category.validation.js'

function toCategoryDto(category: {
  id: string
  name: string
  type: CategoryDto['type']
  color: string | null
  createdAt: Date
  updatedAt: Date
}): CategoryDto {
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    color: category.color,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }
}

export const categoryService = {
  async seedDefaultsForUser(userId: string): Promise<void> {
    await categoryRepository.createManyDefaults(userId, ALL_DEFAULT_CATEGORIES)
  },

  async list(userId: string, query: CategoryQueryInput): Promise<CategoryDto[]> {
    const categories = await categoryRepository.findManyByUser(userId, query.type)
    return categories.map(toCategoryDto)
  },

  async create(userId: string, input: CreateCategoryInput): Promise<CategoryDto> {
    const duplicate = await categoryRepository.findByNameForUser(
      userId,
      input.name,
      input.type,
    )
    if (duplicate) {
      throw new AppError(
        409,
        `Category "${input.name}" already exists for ${input.type} type`,
      )
    }

    const category = await categoryRepository.create({
      name: input.name,
      type: input.type,
      color: input.color ?? null,
      user: { connect: { id: userId } },
    })

    return toCategoryDto(category)
  },

  async update(
    userId: string,
    categoryId: string,
    input: UpdateCategoryInput,
  ): Promise<CategoryDto> {
    const existing = await categoryRepository.findByIdForUser(categoryId, userId)
    if (!existing) {
      throw new AppError(404, 'Category not found')
    }

    if (input.name && input.name !== existing.name) {
      const duplicate = await categoryRepository.findByNameForUser(
        userId,
        input.name,
        existing.type,
        categoryId,
      )
      if (duplicate) {
        throw new AppError(
          409,
          `Category "${input.name}" already exists for ${existing.type} type`,
        )
      }
    }

    const category = await categoryRepository.update(categoryId, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
    })

    return toCategoryDto(category)
  },

  async delete(userId: string, categoryId: string): Promise<void> {
    const existing = await categoryRepository.findByIdForUser(categoryId, userId)
    if (!existing) {
      throw new AppError(404, 'Category not found')
    }

    try {
      await categoryRepository.delete(categoryId)
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2003' || error.code === 'P2014')
      ) {
        throw new AppError(
          409,
          'Cannot delete category that has transactions. Remove or reassign transactions first.',
        )
      }
      throw error
    }
  },
}

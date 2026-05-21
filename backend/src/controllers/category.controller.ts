import type { Request, Response } from 'express'
import { categoryService } from '../services/category.service.js'
import type {
  CategoryQueryInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../validations/category.validation.js'

export async function listCategories(req: Request, res: Response) {
  const query = (res.locals.validatedQuery ?? req.query) as CategoryQueryInput
  const categories = await categoryService.list(req.user!.id, query)

  res.json({
    success: true,
    message: 'Categories retrieved',
    data: { categories },
  })
}

export async function createCategory(req: Request, res: Response) {
  const body = req.body as CreateCategoryInput
  const category = await categoryService.create(req.user!.id, body)

  res.status(201).json({
    success: true,
    message: 'Category created',
    data: { category },
  })
}

export async function updateCategory(req: Request, res: Response) {
  const body = req.body as UpdateCategoryInput
  const category = await categoryService.update(req.user!.id, req.params.id as string, body)

  res.json({
    success: true,
    message: 'Category updated',
    data: { category },
  })
}

export async function deleteCategory(req: Request, res: Response) {
  await categoryService.delete(req.user!.id, req.params.id as string)

  res.json({
    success: true,
    message: 'Category deleted',
    data: null,
  })
}

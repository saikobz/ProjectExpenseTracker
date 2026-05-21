import { Router } from 'express'
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '../controllers/category.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateBody, validateQuery } from '../middlewares/validate.middleware.js'
import {
  categoryQuerySchema,
  createCategorySchema,
  updateCategorySchema,
} from '../validations/category.validation.js'

export const categoryRouter = Router()

categoryRouter.use(authenticate)

categoryRouter.get('/categories', validateQuery(categoryQuerySchema), listCategories)
categoryRouter.post('/categories', validateBody(createCategorySchema), createCategory)
categoryRouter.patch(
  '/categories/:id',
  validateBody(updateCategorySchema),
  updateCategory,
)
categoryRouter.delete('/categories/:id', deleteCategory)

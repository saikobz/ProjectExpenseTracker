import { Router } from 'express'
import {
  createBudget,
  deleteBudget,
  listBudgets,
  updateBudget,
} from '../controllers/budget.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateBody, validateQuery } from '../middlewares/validate.middleware.js'
import {
  budgetListQuerySchema,
  createBudgetSchema,
  updateBudgetSchema,
} from '../validations/budget.validation.js'

export const budgetRouter = Router()

budgetRouter.use(authenticate)

budgetRouter.get('/budgets', validateQuery(budgetListQuerySchema), listBudgets)
budgetRouter.post('/budgets', validateBody(createBudgetSchema), createBudget)
budgetRouter.patch('/budgets/:id', validateBody(updateBudgetSchema), updateBudget)
budgetRouter.delete('/budgets/:id', deleteBudget)

import type { Request, Response } from 'express'
import { budgetService } from '../services/budget.service.js'
import type {
  BudgetListQuery,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '../validations/budget.validation.js'

export async function listBudgets(req: Request, res: Response) {
  const query = (res.locals.validatedQuery ?? req.query) as BudgetListQuery
  const budgets = await budgetService.list(req.user!.id, query)

  res.json({
    success: true,
    message: 'Budgets retrieved',
    data: { budgets },
  })
}

export async function createBudget(req: Request, res: Response) {
  const body = req.body as CreateBudgetInput
  const budget = await budgetService.create(req.user!.id, body)

  res.status(201).json({
    success: true,
    message: 'Budget created',
    data: { budget },
  })
}

export async function updateBudget(req: Request, res: Response) {
  const body = req.body as UpdateBudgetInput
  const budget = await budgetService.update(req.user!.id, req.params.id as string, body)

  res.json({
    success: true,
    message: 'Budget updated',
    data: { budget },
  })
}

export async function deleteBudget(req: Request, res: Response) {
  await budgetService.delete(req.user!.id, req.params.id as string)

  res.json({
    success: true,
    message: 'Budget deleted',
    data: null,
  })
}

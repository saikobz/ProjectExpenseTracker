import type { Request, Response } from 'express'
import { dashboardService } from '../services/dashboard.service.js'
import type {
  DashboardMonthYearQuery,
  DashboardRecentQuery,
  DashboardYearQuery,
} from '../validations/dashboard.validation.js'

export async function getSummary(req: Request, res: Response) {
  const query = (res.locals.validatedQuery ?? req.query) as DashboardMonthYearQuery
  const summary = await dashboardService.getSummary(req.user!.id, query)

  res.json({
    success: true,
    message: 'Dashboard summary retrieved',
    data: { summary },
  })
}

export async function getCategoryExpenses(req: Request, res: Response) {
  const query = (res.locals.validatedQuery ?? req.query) as DashboardMonthYearQuery
  const categoryExpenses = await dashboardService.getCategoryExpenses(req.user!.id, query)

  res.json({
    success: true,
    message: 'Category expenses retrieved',
    data: { categoryExpenses },
  })
}

export async function getMonthlyTrend(req: Request, res: Response) {
  const query = (res.locals.validatedQuery ?? req.query) as DashboardYearQuery
  const monthlyTrend = await dashboardService.getMonthlyTrend(req.user!.id, query)

  res.json({
    success: true,
    message: 'Monthly trend retrieved',
    data: { monthlyTrend },
  })
}

export async function getRecentTransactions(req: Request, res: Response) {
  const query = (res.locals.validatedQuery ?? req.query) as DashboardRecentQuery
  const recentTransactions = await dashboardService.getRecentTransactions(req.user!.id, query)

  res.json({
    success: true,
    message: 'Recent transactions retrieved',
    data: { recentTransactions },
  })
}

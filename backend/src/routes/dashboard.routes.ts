import { Router } from 'express'
import {
  getCategoryExpenses,
  getMonthlyTrend,
  getRecentTransactions,
  getSummary,
} from '../controllers/dashboard.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateQuery } from '../middlewares/validate.middleware.js'
import {
  dashboardMonthYearQuerySchema,
  dashboardRecentQuerySchema,
  dashboardYearQuerySchema,
} from '../validations/dashboard.validation.js'

export const dashboardRouter = Router()

dashboardRouter.use(authenticate)

dashboardRouter.get(
  '/dashboard/summary',
  validateQuery(dashboardMonthYearQuerySchema),
  getSummary,
)
dashboardRouter.get(
  '/dashboard/category-expenses',
  validateQuery(dashboardMonthYearQuerySchema),
  getCategoryExpenses,
)
dashboardRouter.get(
  '/dashboard/monthly-trend',
  validateQuery(dashboardYearQuerySchema),
  getMonthlyTrend,
)
dashboardRouter.get(
  '/dashboard/recent-transactions',
  validateQuery(dashboardRecentQuerySchema),
  getRecentTransactions,
)

import { Router } from 'express'
import { exportCsv, getMonthlyReport, getYearlyReport } from '../controllers/report.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateQuery } from '../middlewares/validate.middleware.js'
import {
  reportExportCsvQuerySchema,
  reportMonthYearQuerySchema,
  reportYearQuerySchema,
} from '../validations/report.validation.js'

export const reportRouter = Router()

reportRouter.use(authenticate)

reportRouter.get('/reports/monthly', validateQuery(reportMonthYearQuerySchema), getMonthlyReport)
reportRouter.get('/reports/yearly', validateQuery(reportYearQuerySchema), getYearlyReport)
reportRouter.get(
  '/reports/export-csv',
  validateQuery(reportExportCsvQuerySchema),
  exportCsv,
)

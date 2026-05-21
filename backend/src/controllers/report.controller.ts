import type { Request, Response } from 'express'
import { reportService } from '../services/report.service.js'
import type {
  ReportExportCsvQuery,
  ReportMonthYearQuery,
  ReportYearQuery,
} from '../validations/report.validation.js'

export async function getMonthlyReport(req: Request, res: Response) {
  const query = (res.locals.validatedQuery ?? req.query) as ReportMonthYearQuery
  const report = await reportService.getMonthlyReport(req.user!.id, query)

  res.json({
    success: true,
    message: 'Monthly report retrieved',
    data: { report },
  })
}

export async function getYearlyReport(req: Request, res: Response) {
  const query = (res.locals.validatedQuery ?? req.query) as ReportYearQuery
  const report = await reportService.getYearlyReport(req.user!.id, query)

  res.json({
    success: true,
    message: 'Yearly report retrieved',
    data: { report },
  })
}

export async function exportCsv(req: Request, res: Response) {
  const query = (res.locals.validatedQuery ?? req.query) as ReportExportCsvQuery
  const csv = await reportService.exportCsv(req.user!.id, query)
  const filename = `moneymind-transactions-${query.from}-to-${query.to}.csv`

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(csv)
}

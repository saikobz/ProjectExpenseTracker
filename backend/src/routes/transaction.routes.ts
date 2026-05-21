import { Router } from 'express'
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
} from '../controllers/transaction.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateBody, validateQuery } from '../middlewares/validate.middleware.js'
import {
  createTransactionSchema,
  transactionListQuerySchema,
  updateTransactionSchema,
} from '../validations/transaction.validation.js'

export const transactionRouter = Router()

transactionRouter.use(authenticate)

transactionRouter.get(
  '/transactions',
  validateQuery(transactionListQuerySchema),
  listTransactions,
)
transactionRouter.get('/transactions/:id', getTransaction)
transactionRouter.post(
  '/transactions',
  validateBody(createTransactionSchema),
  createTransaction,
)
transactionRouter.patch(
  '/transactions/:id',
  validateBody(updateTransactionSchema),
  updateTransaction,
)
transactionRouter.delete('/transactions/:id', deleteTransaction)

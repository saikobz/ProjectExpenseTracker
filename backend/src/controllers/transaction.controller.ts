import type { Request, Response } from 'express'
import { transactionService } from '../services/transaction.service.js'
import type {
  CreateTransactionInput,
  TransactionListQueryInput,
  UpdateTransactionInput,
} from '../validations/transaction.validation.js'

export async function listTransactions(req: Request, res: Response) {
  const query = (res.locals.validatedQuery ?? req.query) as TransactionListQueryInput
  const result = await transactionService.list(req.user!.id, query)

  res.json({
    success: true,
    message: 'Transactions retrieved',
    data: result,
  })
}

export async function getTransaction(req: Request, res: Response) {
  const transaction = await transactionService.getById(req.user!.id, req.params.id as string)

  res.json({
    success: true,
    message: 'Transaction retrieved',
    data: { transaction },
  })
}

export async function createTransaction(req: Request, res: Response) {
  const body = req.body as CreateTransactionInput
  const transaction = await transactionService.create(req.user!.id, body)

  res.status(201).json({
    success: true,
    message: 'Transaction created',
    data: { transaction },
  })
}

export async function updateTransaction(req: Request, res: Response) {
  const body = req.body as UpdateTransactionInput
  const transaction = await transactionService.update(
    req.user!.id,
    req.params.id as string,
    body,
  )

  res.json({
    success: true,
    message: 'Transaction updated',
    data: { transaction },
  })
}

export async function deleteTransaction(req: Request, res: Response) {
  await transactionService.delete(req.user!.id, req.params.id as string)

  res.json({
    success: true,
    message: 'Transaction deleted',
    data: null,
  })
}

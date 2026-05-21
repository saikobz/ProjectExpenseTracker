import type { NextFunction, Request, Response } from 'express'
import type { z } from 'zod'
import { AppError } from './error.middleware.js'

export function validateBody<T extends z.ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? 'Validation failed'
      next(new AppError(400, message))
      return
    }

    req.body = result.data
    next()
  }
}

export function validateQuery<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? 'Validation failed'
      next(new AppError(400, message))
      return
    }

    res.locals.validatedQuery = result.data as Record<string, unknown>
    next()
  }
}

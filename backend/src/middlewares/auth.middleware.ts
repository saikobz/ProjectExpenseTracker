import type { NextFunction, Request, Response } from 'express'
import { authService } from '../services/auth.service.js'
import { verifyToken } from '../utils/jwt.js'
import { AppError } from './error.middleware.js'

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(401, 'Authentication required'))
    return
  }

  const token = authHeader.slice(7)

  try {
    const payload = verifyToken(token)
    req.user = await authService.getMe(payload.userId)
    next()
  } catch {
    next(new AppError(401, 'Invalid or expired token'))
  }
}

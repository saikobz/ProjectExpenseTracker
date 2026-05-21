import type { Request, Response } from 'express'
import { authService } from '../services/auth.service.js'
import type { LoginInput, RegisterInput } from '../validations/auth.validation.js'

export async function register(req: Request, res: Response) {
  const body = req.body as RegisterInput
  const { user, token } = await authService.register(body)

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user, token },
  })
}

export async function login(req: Request, res: Response) {
  const body = req.body as LoginInput
  const { user, token } = await authService.login(body)

  res.json({
    success: true,
    message: 'Login successful',
    data: { user, token },
  })
}

export async function me(req: Request, res: Response) {
  res.json({
    success: true,
    message: 'User profile retrieved',
    data: { user: req.user },
  })
}

export async function logout(_req: Request, res: Response) {
  res.json({
    success: true,
    message: 'Logout successful',
    data: null,
  })
}

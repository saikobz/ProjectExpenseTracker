import { Router } from 'express'
import { login, logout, me, register } from '../controllers/auth.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateBody } from '../middlewares/validate.middleware.js'
import { loginSchema, registerSchema } from '../validations/auth.validation.js'

export const authRouter = Router()

authRouter.post('/auth/register', validateBody(registerSchema), register)
authRouter.post('/auth/login', validateBody(loginSchema), login)
authRouter.get('/auth/me', authenticate, me)
authRouter.post('/auth/logout', authenticate, logout)

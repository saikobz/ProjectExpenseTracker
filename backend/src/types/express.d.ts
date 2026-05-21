import type { SafeUser } from './auth.js'

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser
    }

    interface Locals {
      validatedQuery?: Record<string, unknown>
    }
  }
}

export {}

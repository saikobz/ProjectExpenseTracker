import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from './auth.validation.js'

describe('auth validation', () => {
  it('accepts valid register input', () => {
    const result = registerSchema.safeParse({
      name: 'Demo User',
      email: 'demo@moneymind.app',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects short passwords on register', () => {
    const result = registerSchema.safeParse({
      name: 'Demo',
      email: 'demo@moneymind.app',
      password: 'short',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid login input', () => {
    const result = loginSchema.safeParse({
      email: 'demo@moneymind.app',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty login password', () => {
    const result = loginSchema.safeParse({
      email: 'demo@moneymind.app',
      password: '',
    })
    expect(result.success).toBe(false)
  })
})

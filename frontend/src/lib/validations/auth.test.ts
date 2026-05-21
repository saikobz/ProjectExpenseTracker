import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from './auth'

describe('loginSchema', () => {
  it('requires password', () => {
    const result = loginSchema.safeParse({ email: 'demo@moneymind.app', password: '' })
    expect(result.success).toBe(false)
  })

  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'demo@moneymind.app',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })
})

describe('registerSchema', () => {
  it('requires matching passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Demo',
      email: 'demo@moneymind.app',
      password: 'password123',
      confirmPassword: 'different',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid registration', () => {
    const result = registerSchema.safeParse({
      name: 'Demo User',
      email: 'demo@moneymind.app',
      password: 'password123',
      confirmPassword: 'password123',
    })
    expect(result.success).toBe(true)
  })
})

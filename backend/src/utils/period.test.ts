import { describe, expect, it, vi } from 'vitest'
import { resolveMonthYear } from './period.js'

describe('resolveMonthYear', () => {
  it('uses provided month and year', () => {
    expect(resolveMonthYear({ month: 3, year: 2024 })).toEqual({ month: 3, year: 2024 })
  })

  it('defaults to current UTC month and year when omitted', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-15T12:00:00.000Z'))

    expect(resolveMonthYear({})).toEqual({ month: 5, year: 2026 })

    vi.useRealTimers()
  })
})

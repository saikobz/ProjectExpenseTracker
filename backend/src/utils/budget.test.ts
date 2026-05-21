import { describe, expect, it } from 'vitest'
import { computeBudgetUsage } from './budget.js'

describe('computeBudgetUsage', () => {
  it('returns normal status below 80% usage', () => {
    expect(computeBudgetUsage(100, 500)).toEqual({
      usagePercentage: 20,
      remaining: 400,
      status: 'normal',
    })
  })

  it('returns warning status at 80% usage', () => {
    expect(computeBudgetUsage(400, 500)).toEqual({
      usagePercentage: 80,
      remaining: 100,
      status: 'warning',
    })
  })

  it('returns over_budget above 100% usage', () => {
    expect(computeBudgetUsage(600, 500)).toEqual({
      usagePercentage: 120,
      remaining: -100,
      status: 'over_budget',
    })
  })

  it('handles zero budget amount', () => {
    expect(computeBudgetUsage(50, 0)).toEqual({
      usagePercentage: 0,
      remaining: -50,
      status: 'normal',
    })
  })
})

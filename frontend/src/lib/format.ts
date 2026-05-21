export type MoneyType = 'income' | 'expense' | 'neutral'

export function formatMoney(
  amount: number,
  options?: { type?: MoneyType; showSign?: boolean },
): string {
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  if (!options?.showSign || options.type === 'neutral') {
    return formatted
  }

  if (options.type === 'income') {
    return `+${formatted}`
  }

  return `-${formatted}`
}

export function formatAmountWithType(amount: number, type: 'income' | 'expense'): string {
  return formatMoney(amount, { type, showSign: true })
}

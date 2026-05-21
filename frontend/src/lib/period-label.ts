const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export function formatMonthYear(month: number, year: number): string {
  const name = MONTH_LABELS[month - 1]
  return name ? `${name} ${year}` : `${month}/${year}`
}

export function formatReportSubtitle(
  month: number,
  year: number,
  mode: 'monthly' | 'yearly',
): string {
  if (mode === 'yearly') {
    return `Annual overview for ${year}`
  }
  return `Monthly breakdown for ${formatMonthYear(month, year)}`
}

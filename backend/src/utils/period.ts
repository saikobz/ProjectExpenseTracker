export type MonthYearQuery = {
  month?: number
  year?: number
}

export function resolveMonthYear(query: MonthYearQuery) {
  const now = new Date()
  return {
    month: query.month ?? now.getUTCMonth() + 1,
    year: query.year ?? now.getUTCFullYear(),
  }
}

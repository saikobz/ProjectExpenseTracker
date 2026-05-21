import { Label } from '@/components/ui/label'
import type { DashboardPeriod } from '@/types/dashboard'

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

type MonthYearSelectorProps = {
  period: DashboardPeriod
  onChange: (period: DashboardPeriod) => void
}

export function MonthYearSelector({ period, onChange }: MonthYearSelectorProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i)

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-2">
        <Label htmlFor="month">Month</Label>
        <select
          id="month"
          className="flex h-9 min-w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm"
          value={period.month}
          onChange={(e) => onChange({ ...period, month: Number(e.target.value) })}
        >
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <select
          id="year"
          className="flex h-9 min-w-[100px] rounded-md border border-input bg-background px-3 py-1 text-sm"
          value={period.year}
          onChange={(e) => onChange({ ...period, year: Number(e.target.value) })}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

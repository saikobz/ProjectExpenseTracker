import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyTrendItem } from '@/types/dashboard'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

type MonthlyTrendChartProps = {
  data: MonthlyTrendItem[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartData = data.map((item) => ({
    name: MONTH_LABELS[item.month - 1] ?? `M${item.month}`,
    income: item.income,
    expense: item.expense,
  }))

  const hasData = chartData.some((d) => d.income > 0 || d.expense > 0)

  if (!hasData) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No transaction data for this year.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) =>
            typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : value
          }
        />
        <Legend />
        <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

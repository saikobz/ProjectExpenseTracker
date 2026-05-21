import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { CategoryExpenseItem } from '@/types/dashboard'

type ExpensePieChartProps = {
  data: CategoryExpenseItem[]
}

export function ExpensePieChart({ data }: ExpensePieChartProps) {
  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No expense data for this period.
      </p>
    )
  }

  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: item.amount,
    color: item.color ?? '#6B7280',
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) =>
            typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2 }) : value
          }
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

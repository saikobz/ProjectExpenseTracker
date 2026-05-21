import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CategoryBreakdownItem } from '@/types/report'

type CategoryBreakdownChartProps = {
  data: CategoryBreakdownItem[]
  title?: string
  variant?: 'pie' | 'bar'
}

export function CategoryBreakdownChart({
  data,
  title,
  variant = 'pie',
}: CategoryBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <p className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        No category data for this period.
      </p>
    )
  }

  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: item.amount,
    color: item.color ?? '#6B7280',
  }))

  if (variant === 'bar') {
    return (
      <div className="space-y-2">
        {title && <p className="text-sm font-medium">{title}</p>}
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value) =>
                typeof value === 'number'
                  ? value.toLocaleString(undefined, { minimumFractionDigits: 2 })
                  : value
              }
            />
            <Bar dataKey="value" name="Amount" radius={4}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {title && <p className="text-sm font-medium">{title}</p>}
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              typeof value === 'number'
                ? value.toLocaleString(undefined, { minimumFractionDigits: 2 })
                : value
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

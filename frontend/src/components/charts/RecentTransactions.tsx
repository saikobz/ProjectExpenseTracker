import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { RecentTransactionItem } from '@/types/dashboard'

function formatAmount(amount: number, type: 'income' | 'expense') {
  const formatted = amount.toLocaleString(undefined, { minimumFractionDigits: 2 })
  return type === 'income' ? `+${formatted}` : `-${formatted}`
}

type RecentTransactionsProps = {
  transactions: RecentTransactionItem[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>No recent transactions.</p>
        <Link to="/transactions">
          <Button variant="outline" size="sm">
            Add transaction
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <ul className="divide-y rounded-lg border">
      {transactions.map((tx) => (
        <li key={tx.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
          <div className="min-w-0">
            <p className="font-medium truncate">{tx.description || tx.category.name}</p>
            <p className="text-xs text-muted-foreground">
              {tx.transactionDate} · {tx.category.name}
            </p>
          </div>
          <span
            className={`shrink-0 font-medium tabular-nums ${
              tx.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatAmount(tx.amount, tx.type)}
          </span>
        </li>
      ))}
    </ul>
  )
}

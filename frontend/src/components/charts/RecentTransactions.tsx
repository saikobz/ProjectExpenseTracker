import { Link } from 'react-router-dom'
import { MoneyAmount } from '@/components/common/MoneyAmount'
import { Button } from '@/components/ui/button'
import type { RecentTransactionItem } from '@/types/dashboard'

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
    <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
      {transactions.map((tx) => (
        <li key={tx.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-muted/30">
          <div className="min-w-0">
            <p className="truncate font-medium">{tx.description || tx.category.name}</p>
            <p className="text-xs text-muted-foreground">
              {tx.transactionDate} · {tx.category.name}
            </p>
          </div>
          <MoneyAmount
            amount={tx.amount}
            type={tx.type}
            showSign
            className="shrink-0 font-medium"
          />
        </li>
      ))}
    </ul>
  )
}

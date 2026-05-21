import { MoneyAmount } from '@/components/common/MoneyAmount'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { ReportTransaction } from '@/types/report'

type ReportTransactionTableProps = {
  transactions: ReportTransaction[]
}

export function ReportTransactionTable({ transactions }: ReportTransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No transactions in this period.</p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="sticky top-0 border-b bg-muted/80 backdrop-blur">
          <tr>
            <th className="px-4 py-3 font-medium" scope="col">Date</th>
            <th className="px-4 py-3 font-medium" scope="col">Description</th>
            <th className="px-4 py-3 font-medium" scope="col">Category</th>
            <th className="px-4 py-3 font-medium" scope="col">Type</th>
            <th className="px-4 py-3 font-medium text-right" scope="col">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {transactions.map((tx, i) => (
            <tr
              key={tx.id}
              className={i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
            >
              <td className="px-4 py-3 whitespace-nowrap">{tx.transactionDate}</td>
              <td className="max-w-[180px] truncate px-4 py-3">{tx.description || '—'}</td>
              <td className="px-4 py-3">{tx.category.name}</td>
              <td className="px-4 py-3">
                <StatusBadge kind="transaction" type={tx.type} />
              </td>
              <td className="px-4 py-3 text-right font-medium">
                <MoneyAmount amount={tx.amount} type={tx.type} showSign />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

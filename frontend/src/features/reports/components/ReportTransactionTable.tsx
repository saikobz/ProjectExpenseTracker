import type { ReportTransaction } from '@/types/report'

function formatAmount(amount: number, type: 'income' | 'expense') {
  const formatted = amount.toLocaleString(undefined, { minimumFractionDigits: 2 })
  return type === 'income' ? `+${formatted}` : `-${formatted}`
}

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
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="px-4 py-3 whitespace-nowrap">{tx.transactionDate}</td>
              <td className="px-4 py-3 max-w-[180px] truncate">{tx.description || '—'}</td>
              <td className="px-4 py-3">{tx.category.name}</td>
              <td className="px-4 py-3 capitalize">{tx.type}</td>
              <td
                className={`px-4 py-3 text-right font-medium tabular-nums ${
                  tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatAmount(tx.amount, tx.type)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

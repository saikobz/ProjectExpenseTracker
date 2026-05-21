import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useExportCsv } from '@/features/reports/hooks/useReports'
import { getReportErrorMessage } from '@/services/report.service'
import { cn } from '@/lib/utils'
import type { CsvExportParams } from '@/types/report'

type ExportCsvButtonProps = {
  params: CsvExportParams
  label?: string
  className?: string
}

export function ExportCsvButton({ params, label = 'Export CSV', className }: ExportCsvButtonProps) {
  const exportMutation = useExportCsv()

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync(params)
      toast.success('CSV exported successfully')
    } catch (err) {
      toast.error(getReportErrorMessage(err))
    }
  }

  return (
    <Button
      variant="outline"
      className={cn('shrink-0', className)}
      onClick={() => void handleExport()}
      disabled={exportMutation.isPending}
    >
      <Download className="size-4" />
      {exportMutation.isPending ? 'Exporting...' : label}
    </Button>
  )
}

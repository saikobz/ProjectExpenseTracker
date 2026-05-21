import { Card, CardContent, CardHeader } from '@/components/ui/card'

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? 'h-4 w-full'}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <SkeletonBlock className="h-9 w-36" />
        <SkeletonBlock className="h-9 w-24" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <SkeletonBlock className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <SkeletonBlock className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <SkeletonBlock className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <SkeletonBlock className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <SkeletonBlock className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <SkeletonBlock className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { cn } from '@/lib/cn'
import { statusFromFill } from '@/lib/format'

const fillColor: Record<string, string> = {
  normal: 'bg-status-normal',
  attention: 'bg-status-attention',
  critical: 'bg-status-critical',
  collected: 'bg-status-collected',
}

export function ProgressBar({
  value,
  status,
  className,
  showLabel = false,
}: {
  value: number
  status?: 'normal' | 'attention' | 'critical' | 'collected'
  className?: string
  showLabel?: boolean
}) {
  const resolved = status ?? statusFromFill(value)
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="h-3 w-full overflow-hidden rounded border-2 border-ink-900 bg-paper"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full transition-[width] duration-500', fillColor[resolved])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-10 shrink-0 text-right text-xs font-bold tabular-nums text-ink-900">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}
import { cn } from '@/lib/cn'
import { statusFromFill } from '@/lib/format'

const fillColor: Record<string, string> = {
  normal: 'bg-brand-500',
  attention: 'bg-amber-500',
  critical: 'bg-rose-500',
  collected: 'bg-blue-500',
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
        className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500', fillColor[resolved])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-ink-600">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}

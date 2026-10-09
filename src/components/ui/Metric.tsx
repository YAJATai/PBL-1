import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'brand',
  delta,
  onClick,
  className,
}: {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  tone?: 'brand' | 'amber' | 'rose' | 'blue' | 'ink'
  delta?: { value: string; positive: boolean }
  onClick?: () => void
  className?: string
}) {
  const toneMap = {
    brand: 'bg-tone-teal text-[#006e73]',
    amber: 'bg-tone-yellow text-[#8a6d00]',
    rose: 'bg-tone-danger text-[#d90429]',
    blue: 'bg-tone-teal text-[#006e73]',
    ink: 'bg-ink-100 text-ink-900',
  }
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cn(
        'group flex w-full flex-col rounded-xl border-2 border-ink-900 bg-surface p-4 text-left shadow-card transition',
        onClick &&
          'cursor-pointer hover:-translate-y-0.5 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink-900',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-600">{label}</span>
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink-900', toneMap[tone])}>
          <Icon className="h-[16px] w-[16px]" aria-hidden />
        </span>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-bold tracking-tight tabular-nums text-ink-900">{value}</span>
        {delta && (
          <span
            className={cn(
              'mb-1 inline-flex items-center gap-0.5 text-xs font-bold',
              delta.positive ? 'text-status-normal' : 'text-status-critical',
            )}
          >
            {delta.positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {delta.value}
          </span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-ink-600">{hint}</p>}
    </Comp>
  )
}
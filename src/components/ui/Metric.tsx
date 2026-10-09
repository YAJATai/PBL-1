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
    brand: 'bg-brand-50 text-brand-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
    blue: 'bg-blue-50 text-blue-700',
    ink: 'bg-ink-100 text-ink-700',
  }
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cn(
        'group flex w-full flex-col rounded-2xl border border-ink-100 bg-surface p-5 text-left shadow-card transition',
        onClick &&
          'cursor-pointer hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-500">{label}</span>
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-xl', toneMap[tone])}>
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-2xl font-semibold tracking-tight tabular-nums text-ink-900">
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              'mb-1 inline-flex items-center gap-0.5 text-xs font-semibold',
              delta.positive ? 'text-brand-600' : 'text-rose-600',
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
      {hint && <p className="mt-2 text-xs text-ink-400">{hint}</p>}
    </Comp>
  )
}

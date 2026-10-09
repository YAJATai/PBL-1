import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink-900 bg-surface-muted px-6 py-10 text-center',
        className,
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-ink-900 bg-surface text-ink-900 shadow-brutal-sm">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <p className="mt-3 text-sm font-bold uppercase tracking-wide text-ink-800">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
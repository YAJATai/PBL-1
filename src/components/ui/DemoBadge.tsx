import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/cn'

export function DemoBadge({ className, label = 'Demo data' }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600',
        className,
      )}
    >
      <FlaskConical className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  )
}

import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/cn'

export function DemoBadge({ className, label = 'Demo data' }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border-2 border-ink-900 bg-neon-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-950',
        className,
      )}
    >
      <FlaskConical className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  )
}
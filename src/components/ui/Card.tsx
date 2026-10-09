import { cn } from '@/lib/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean
}

export function Card({ className, padded = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-ink-100 bg-surface shadow-card',
        padded && 'p-5',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <h3 className="text-base font-semibold tracking-tight text-ink-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

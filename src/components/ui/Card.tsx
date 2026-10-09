import { cn } from '@/lib/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean
  tone?: 'white' | 'paper' | 'dark' | 'teal' | 'yellow'
}

const tones = {
  white: 'bg-surface',
  paper: 'bg-paper',
  dark: 'bg-ink-900 text-white',
  teal: 'bg-neon-teal',
  yellow: 'bg-tone-yellow',
}

export function Card({ className, padded = true, tone = 'white', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 border-ink-900',
        tones[tone],
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
        <h3 className="text-sm font-bold uppercase tracking-tight text-ink-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-600">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
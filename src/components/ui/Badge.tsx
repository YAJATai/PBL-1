import { cn } from '@/lib/cn'
import type { AlertSeverity, BinStatus, StopStatus } from '@/types'

type Tone = 'neutral' | 'success' | 'warning' | 'critical' | 'info' | 'brand'

const tones: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
  success: 'bg-brand-50 text-brand-700 ring-brand-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  critical: 'bg-rose-50 text-rose-700 ring-rose-200',
  info: 'bg-blue-50 text-blue-700 ring-blue-200',
  brand: 'bg-brand-600 text-white ring-brand-600',
}

export function Badge({
  tone = 'neutral',
  children,
  className,
  dot = false,
}: {
  tone?: Tone
  children: React.ReactNode
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  )
}

const binTone: Record<BinStatus, Tone> = {
  normal: 'success',
  attention: 'warning',
  critical: 'critical',
  collected: 'info',
}

export function BinStatusBadge({ status }: { status: BinStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <Badge tone={binTone[status]} dot>
      {label}
    </Badge>
  )
}

const severityTone: Record<AlertSeverity, Tone> = {
  critical: 'critical',
  warning: 'warning',
  info: 'info',
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return <Badge tone={severityTone[severity]}>{severity.toUpperCase()}</Badge>
}

const stopTone: Record<StopStatus, Tone> = {
  pending: 'neutral',
  enroute: 'info',
  arrived: 'warning',
  collected: 'success',
  skipped: 'neutral',
}

export function StopStatusBadge({ status }: { status: StopStatus }) {
  const label = status === 'enroute' ? 'En route' : status.charAt(0).toUpperCase() + status.slice(1)
  return <Badge tone={stopTone[status]}>{label}</Badge>
}

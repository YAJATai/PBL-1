import { cn } from '@/lib/cn'
import type { AlertSeverity, BinStatus, StopStatus } from '@/types'

type Tone = 'neutral' | 'success' | 'warning' | 'critical' | 'info' | 'brand'

const tones: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-900 border-ink-900',
  success: 'bg-tone-success text-[#007a3d] border-ink-900',
  warning: 'bg-tone-yellow text-ink-900 border-ink-900',
  critical: 'bg-tone-danger text-[#d90429] border-ink-900',
  info: 'bg-tone-teal text-[#006e73] border-ink-900',
  brand: 'bg-neon-teal text-ink-950 border-ink-900',
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
        'inline-flex items-center gap-1.5 rounded-md border-2 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider',
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
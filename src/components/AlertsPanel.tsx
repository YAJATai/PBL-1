import { AlertTriangle, BellOff, Check, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/format'
import { useApp } from '@/store/AppContext'
import { Button } from '@/components/ui/Button'
import { SeverityBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Alert } from '@/types'

export function AlertsPanel({ alerts, compact = false }: { alerts: Alert[]; compact?: boolean }) {
  const { acknowledgeAlert, resolveAlert, pushToast } = useApp()
  const active = alerts
    .filter((a) => a.status !== 'resolved')
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'critical' ? -1 : 1))

  if (active.length === 0) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="All clear"
        description="No open alerts. Bins are within operating thresholds."
      />
    )
  }

  return (
    <ul className="space-y-3">
      {active.map((a) => (
        <li
          key={a.id}
          className={cn(
            'rounded-xl border p-3.5',
            a.severity === 'critical' ? 'border-rose-200 bg-rose-50/60' : 'border-amber-200 bg-amber-50/60',
          )}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={cn('mt-0.5 h-4 w-4 shrink-0', a.severity === 'critical' ? 'text-rose-600' : 'text-amber-600')}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={a.severity} />
                {a.status === 'acknowledged' && (
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-500">
                    Acknowledged
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm font-semibold text-ink-800">{a.title}</p>
              {!compact && <p className="mt-0.5 text-sm text-ink-500">{a.message}</p>}
              <p className="mt-1 text-xs text-ink-400">Raised {formatRelativeTime(a.createdAt)}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 pl-7">
            {a.status === 'open' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  acknowledgeAlert(a.id)
                  pushToast({ variant: 'info', title: 'Alert acknowledged', description: a.title })
                }}
              >
                <BellOff className="h-3.5 w-3.5" />
                Acknowledge
              </Button>
            )}
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                resolveAlert(a.id)
                pushToast({ variant: 'success', title: 'Alert resolved', description: a.title })
              }}
            >
              <Check className="h-3.5 w-3.5" />
              Mark resolved
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

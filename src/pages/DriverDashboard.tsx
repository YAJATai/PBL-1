import {
  CheckCircle2,
  CircleDot,
  Flag,
  MapPin,
  Navigation,
  Play,
  Route as RouteIcon,
  Truck,
  UserRound,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp } from '@/store/AppContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, StopStatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { DemoBadge } from '@/components/ui/DemoBadge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { cn } from '@/lib/cn'
import type { PickupTask } from '@/types'

const priorityTone = { critical: 'critical', high: 'warning', normal: 'neutral' } as const

export function DriverDashboard() {
  const { state, startShift, arrivePickup, completePickup, pushToast } = useApp()
  const driver = useMemo(
    () => state.drivers.find((d) => d.onShift) ?? state.drivers[0],
    [state.drivers],
  )
  const vehicle = state.vehicles.find((v) => v.id === driver.vehicleId)
  const [confirmTask, setConfirmTask] = useState<PickupTask | null>(null)

  const stops = useMemo(
    () =>
      state.tasks
        .filter((t) => t.vehicleId === driver.vehicleId)
        .sort((a, b) => {
          const order = { critical: 0, high: 1, normal: 2 }
          if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority]
          return a.sequence - b.sequence
        }),
    [state.tasks, driver.vehicleId],
  )

  const completed = stops.filter((s) => s.status === 'collected').length
  const remaining = stops.length - completed
  const progress = stops.length ? Math.round((completed / stops.length) * 100) : 0
  const nextStop = stops.find((s) => s.status !== 'collected')
  const estDistance = (stops.length * 0.42).toFixed(1)

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Card className="border-ink-900 bg-[#064e3b] text-white shadow-card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white/25 bg-white/10">
              <UserRound className="h-5 w-5 text-neon-teal" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neon-gold">Driver</p>
              <p className="text-lg font-display uppercase tracking-tight">{driver.name}</p>
            </div>
          </div>
          <Badge tone={driver.onShift ? 'success' : 'neutral'} dot>
            {driver.onShift ? 'On shift' : 'Off shift'}
          </Badge>
        </div>
        <div className="mt-5 flex items-center justify-between text-sm text-white/70">
          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4" /> {vehicle?.name} · {vehicle?.code}
          </span>
          <span className="tabular-nums text-white">{progress}% complete</span>
        </div>
        <div className="mt-3">
          <div className="h-3 w-full overflow-hidden rounded border-2 border-white/30 bg-white/10">
            <div className="h-full rounded bg-neon-teal transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {!driver.onShift && (
          <Button
            className="mt-5 w-full"
            size="lg"
            onClick={() => {
              startShift(driver.id)
              pushToast({ variant: 'success', title: 'Shift started', description: `Route assigned to ${vehicle?.name ?? 'vehicle'}.` })
            }}
          >
            <Play className="h-4 w-4" /> Start shift
          </Button>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryTile label="Total stops" value={String(stops.length)} />
        <SummaryTile label="Completed" value={String(completed)} tone="brand" />
        <SummaryTile label="Remaining" value={String(remaining)} />
        <SummaryTile label="Est. distance" value={`${estDistance} km`} hint="Demo estimate" />
      </div>

      <Card className="bg-surface-muted shadow-brutal-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink-900 bg-tone-teal text-[#006e73] shadow-brutal-sm">
            <RouteIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-800">Route recommendation</p>
            <p className="mt-0.5 text-sm text-ink-500">
              Prototype heuristic: collect critical bins first, then order remaining stops by estimated
              distance. Not a production routing engine.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-400">Assigned pickups</h3>
        <DemoBadge label="Simulated route" />
      </div>

      <ul className="space-y-3">
        {stops.map((task) => {
          const bin = state.bins.find((b) => b.id === task.binId)
          const isNext = nextStop?.id === task.id
          const collected = task.status === 'collected'
          return (
            <li
              key={task.id}
              className={cn(
                'rounded-xl border-2 bg-surface p-4 shadow-card',
                collected
                  ? 'border-ink-900/30 opacity-70 shadow-brutal-sm'
                  : isNext
                    ? 'border-ink-900 bg-tone-yellow shadow-raised'
                    : 'border-ink-900',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink-900 text-sm font-bold shadow-brutal-sm',
                      collected
                        ? 'bg-tone-success text-[#007a3d]'
                        : isNext
                          ? 'bg-neon-gold text-ink-950'
                          : 'bg-paper text-ink-600',
                    )}
                  >
                    {task.sequence}
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900">{bin?.code}</p>
                    <p className="flex items-center gap-1 text-sm text-ink-500">
                      <MapPin className="h-3.5 w-3.5" /> {bin?.zone}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
                  <StopStatusBadge status={task.status} />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
                <span className="capitalize">{bin?.category}</span>
                <span className="tabular-nums">Fill {Math.round(bin?.fill ?? 0)}%</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar value={bin?.fill ?? 0} status={bin?.status} />
              </div>

              {!collected && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {task.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => {
                        arrivePickup(task.id)
                        pushToast({ variant: 'info', title: 'Arrival logged', description: `You arrived at ${bin?.zone}.` })
                      }}
                    >
                      <Navigation className="h-4 w-4" /> Mark arrival
                    </Button>
                  )}
                  {task.status === 'arrived' && (
                    <Button size="lg" className="flex-1" onClick={() => setConfirmTask(task)}>
                      <CheckCircle2 className="h-4 w-4" /> Mark collected
                    </Button>
                  )}
                  {task.status === 'pending' && (
                    <Button size="lg" className="flex-1" onClick={() => setConfirmTask(task)}>
                      <CheckCircle2 className="h-4 w-4" /> Collect now
                    </Button>
                  )}
                </div>
              )}

              {collected && (
                <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-[#007a3d]">
                  <CheckCircle2 className="h-4 w-4" /> Collected and synced to campus operations
                </p>
              )}
            </li>
          )
        })}

        {stops.length === 0 && (
          <li className="rounded-xl border-2 border-dashed border-ink-900 bg-surface-muted p-8 text-center text-sm font-medium text-ink-500">
            No pickups assigned to this vehicle. Check back after dispatch assigns a route.
          </li>
        )}
      </ul>

      {stops.length > 0 && remaining === 0 && (
        <Card className="flex flex-col items-center py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink-900 bg-tone-success text-[#007a3d] shadow-card">
            <Flag className="h-7 w-7" />
          </span>
          <p className="mt-3 text-lg font-display uppercase tracking-tight text-ink-900">Route complete</p>
          <p className="mt-1 text-sm text-ink-500">
            All {stops.length} stops collected. Admin dashboard reflects the updated bin statuses.
          </p>
        </Card>
      )}

      <Card className="bg-surface-muted">
        <p className="flex items-start gap-2 text-xs text-ink-500">
          <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Vehicle GPS, route distance and ETAs are simulated. Completing a pickup updates the shared
          bin status, alert state and admin activity feed in this demo.
        </p>
      </Card>

      <ConfirmDialog
        open={confirmTask !== null}
        onClose={() => setConfirmTask(null)}
        onConfirm={() => {
          if (!confirmTask) return
          completePickup(confirmTask.id)
          const bin = state.bins.find((b) => b.id === confirmTask.binId)
          pushToast({
            variant: 'success',
            title: 'Pickup completed',
            description: `${bin?.code ?? 'Bin'} collected and synced.`,
          })
          setConfirmTask(null)
        }}
        title={`Complete pickup for ${state.bins.find((b) => b.id === confirmTask?.binId)?.code ?? ''}?`}
        description="This marks the bin as collected, resets its fill level, updates the vehicle route and resolves any related alert in the admin dashboard."
        confirmLabel="Confirm collection"
      />
    </div>
  )
}

function SummaryTile({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'brand'
}) {
  return (
    <Card padded={false} className="p-3.5 shadow-brutal-sm">
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{label}</p>
      <p className={cn('mt-1 text-xl font-bold tabular-nums', tone === 'brand' ? 'text-[#007a3d]' : 'text-ink-900')}>
        {value}
      </p>
      {hint && <p className="text-[11px] font-medium text-ink-400">{hint}</p>}
    </Card>
  )
}

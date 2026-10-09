import { Truck, UserRound } from 'lucide-react'
import { useApp } from '@/store/AppContext'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge, StopStatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'

const statusTone = { active: 'success', idle: 'neutral', returning: 'info' } as const

export function AdminVehicles() {
  const { state } = useApp()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display uppercase tracking-tight text-ink-900">Collection Fleet</h2>
        <p className="text-sm text-ink-600">
          Vehicle positions and route progress are simulated demo data.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {state.vehicles.map((v) => {
          const driver = state.drivers.find((d) => d.id === v.driverId)
          const stops = state.tasks
            .filter((t) => t.vehicleId === v.id)
            .sort((a, b) => a.sequence - b.sequence)
          const completed = stops.filter((s) => s.status === 'collected').length
          const progress = stops.length ? Math.round((completed / stops.length) * 100) : 0

          return (
            <Card key={v.id} className="flex flex-col">
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-ink-500" /> {v.name}
                  </span>
                }
                subtitle={v.code}
                action={<Badge tone={statusTone[v.status]} dot>{v.status}</Badge>}
              />

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 rounded-lg border-2 border-ink-900 bg-surface-muted px-3 py-2 text-sm shadow-brutal-sm">
                  <UserRound className="h-4 w-4 text-ink-500" />
                  <span className="font-medium text-ink-700">{driver?.name ?? 'Unassigned'}</span>
                  <span className="ml-auto text-xs text-ink-500">
                    {driver?.onShift ? 'On shift' : 'Off shift'}
                  </span>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-ink-600">
                    <span>Route progress</span>
                    <span className="tabular-nums">
                      {completed}/{stops.length} stops
                    </span>
                  </div>
                  <ProgressBar value={progress} status="normal" />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-ink-600">
                    <span>Load capacity</span>
                    <span className="tabular-nums">{v.capacityPct}%</span>
                  </div>
                  <ProgressBar value={v.capacityPct} status={v.capacityPct >= 85 ? 'critical' : 'normal'} />
                </div>

                <div className="rounded-xl border-2 border-ink-900/25">
                  {stops.map((t, i) => {
                    const bin = state.bins.find((b) => b.id === t.binId)
                    return (
                      <div
                        key={t.id}
                        className={
                          'flex items-center justify-between px-3 py-2 text-sm ' +
                          (i !== stops.length - 1 ? 'border-b-2 border-ink-900/10' : '')
                        }
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink-700">
                            {t.sequence}. {bin?.code}
                          </p>
                          <p className="truncate text-xs text-ink-500">
                            {bin?.zone} · priority {t.priority}
                          </p>
                        </div>
                        <StopStatusBadge status={t.status} />
                      </div>
                    )
                  })}
                  {stops.length === 0 && (
                    <p className="px-3 py-4 text-center text-sm text-ink-500">No stops assigned.</p>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-lg border-2 border-ink-900 bg-surface-muted px-3 py-2 text-xs shadow-brutal-sm">
                  <span className="font-bold text-ink-700">Next stop</span>
                  <span className="text-ink-600">
                    {stops.some((s) => s.status !== 'collected')
                      ? state.bins.find((b) => b.id === stops.find((s) => s.status !== 'collected')?.binId)?.code ?? '—'
                      : 'Route complete'}
                  </span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader title="Driver shifts" subtitle="Active collection personnel" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {state.drivers.map((d) => {
            const v = state.vehicles.find((x) => x.id === d.vehicleId)
            return (
              <div key={d.id} className="flex items-center gap-3 rounded-xl border-2 border-ink-900 bg-surface p-3 shadow-brutal-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink-900 bg-tone-teal text-[#006e73] shadow-brutal-sm">
                  <UserRound className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-800">{d.name}</p>
                  <p className="text-xs text-ink-500">{v?.code ?? 'No vehicle'}</p>
                </div>
                <Badge tone={d.onShift ? 'success' : 'neutral'} className="ml-auto">
                  {d.onShift ? 'On shift' : 'Off'}
                </Badge>
              </div>
            )
          })}
        </div>
      </Card>

      {state.vehicles.length === 0 && (
        <EmptyState icon={Truck} title="No vehicles" description="Add a vehicle to start dispatching routes." />
      )}
    </div>
  )
}

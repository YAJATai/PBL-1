import {
  Activity,
  BellRing,
  CalendarDays,
  PackageCheck,
  Pause,
  Play,
  Recycle,
  RotateCcw,
  Truck,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { BIN_THRESHOLDS } from '@/types'
import { formatDemoDate, formatNumber, formatRelativeTime } from '@/lib/format'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MetricCard } from '@/components/ui/Metric'
import { Badge, BinStatusBadge } from '@/components/ui/Badge'
import { DemoBadge } from '@/components/ui/DemoBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CampusMap } from '@/components/CampusMap'
import { AlertsPanel } from '@/components/AlertsPanel'
import { ActivityFeed } from '@/components/ActivityFeed'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export function AdminOverview() {
  const { state, runSimulationStep, resetDemo, pushToast } = useApp()
  const navigate = useNavigate()
  const [autoRun, setAutoRun] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)

  useEffect(() => {
    if (!autoRun) return
    const id = window.setInterval(() => runSimulationStep(), 2600)
    return () => window.clearInterval(id)
  }, [autoRun, runSimulationStep])

  const needsCollection = state.bins.filter(
    (b) => b.status === 'attention' || b.status === 'critical',
  ).length
  const activeVehicles = state.vehicles.filter((v) => v.status === 'active').length
  const completedToday = state.vehicles.reduce((sum, v) => sum + v.completedToday, 0)
  const openAlerts = state.alerts.filter((a) => a.status !== 'resolved').length

  const selectedBin = state.bins.find((b) => b.id === selectedBinId) ?? null
  const selectedVehicle = state.vehicles.find((v) => v.id === selectedVehicleId) ?? null

  const vehicleStops = useMemo(
    () =>
      selectedVehicle
        ? state.tasks
            .filter((t) => t.vehicleId === selectedVehicle.id)
            .sort((a, b) => a.sequence - b.sequence)
        : [],
    [selectedVehicle, state.tasks],
  )

  const handleSelectBin = (id: string) => {
    setSelectedBinId(id)
    setSelectedVehicleId(null)
  }
  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id)
    setSelectedBinId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-display uppercase tracking-tight text-ink-900">Campus Operations</h2>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500">
            <CalendarDays className="h-3.5 w-3.5" /> {formatDemoDate()}
            <span className="h-1 w-1 rounded-full bg-ink-400" />
            <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wide text-[#007a3d]">
              <span className="h-1.5 w-1.5 rounded-full border border-ink-900 bg-status-normal" />
              Simulation Mode
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DemoBadge label="Simulated telemetry" />
          <Button variant="outline" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button
            variant={autoRun ? 'secondary' : 'outline'}
            onClick={() => setAutoRun((v) => !v)}
          >
            {autoRun ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {autoRun ? 'Pause auto' : 'Auto-run'}
          </Button>
          <Button onClick={() => runSimulationStep()}>
            <Zap className="h-4 w-4" /> Run simulation
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Monitored bins"
          value={formatNumber(state.bins.length)}
          hint="Across 12 named campus zones"
          icon={Recycle}
          tone="brand"
          onClick={() => navigate('/admin/bins')}
        />
        <MetricCard
          label="Requiring collection"
          value={formatNumber(needsCollection)}
          hint={`≥ ${BIN_THRESHOLDS.attention}% fill`}
          icon={BellRing}
          tone="rose"
          delta={{ value: `${openAlerts} open alerts`, positive: false }}
          onClick={() => navigate('/admin/bins')}
        />
        <MetricCard
          label="Active vehicles"
          value={formatNumber(activeVehicles)}
          hint={`${state.vehicles.length} in fleet`}
          icon={Truck}
          tone="blue"
          onClick={() => navigate('/admin/vehicles')}
        />
        <MetricCard
          label="Pickups completed today"
          value={formatNumber(completedToday)}
          hint="Total across all routes"
          icon={PackageCheck}
          tone="brand"
          onClick={() => navigate('/admin/analytics')}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Campus operations map"
            subtitle="Simulated bin fill levels, vehicle positions and collection routes"
            action={<Badge tone="info">Demo positions</Badge>}
          />
          <div className="mt-4">
            <CampusMap
              bins={state.bins}
              vehicles={state.vehicles}
              tasks={state.tasks}
              selectedId={selectedBinId ?? selectedVehicleId}
              onSelectBin={handleSelectBin}
              onSelectVehicle={handleSelectVehicle}
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Selection details"
            subtitle={selectedBin || selectedVehicle ? 'Selected map marker' : 'Tap a marker on the map'}
          />
          <div className="mt-4">
            {!selectedBin && !selectedVehicle && (
              <div className="rounded-xl border-2 border-dashed border-ink-900 bg-surface-muted p-6 text-center text-sm font-medium text-ink-500">
                Select a bin or vehicle on the map to inspect its operational details.
              </div>
            )}

            {selectedBin && (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Bin</p>
                  <p className="text-lg font-bold text-ink-900">{selectedBin.code}</p>
                  <p className="text-sm text-ink-500">{selectedBin.zone}</p>
                </div>
                <div className="flex items-center justify-between">
                  <BinStatusBadge status={selectedBin.status} />
                  <span className="text-sm font-semibold tabular-nums text-ink-700">
                    {Math.round(selectedBin.fill)}%
                  </span>
                </div>
                <ProgressBar value={selectedBin.fill} status={selectedBin.status} />
                <dl className="space-y-2 text-sm">
                  <Detail label="Waste type" value={selectedBin.category} />
                  <Detail label="Last updated" value={formatRelativeTime(selectedBin.lastUpdated)} />
                  <Detail
                    label="Assigned vehicle"
                    value={
                      state.vehicles.find((v) => v.id === selectedBin.assignedVehicleId)?.code ?? 'Unassigned'
                    }
                  />
                </dl>
                <Button variant="outline" className="w-full" onClick={() => navigate('/admin/bins')}>
                  Open bin monitoring
                </Button>
              </div>
            )}

            {selectedVehicle && (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Vehicle</p>
                  <p className="text-lg font-bold text-ink-900">{selectedVehicle.name}</p>
                  <p className="text-sm capitalize text-ink-500">{selectedVehicle.status} · {selectedVehicle.code}</p>
                </div>
                <dl className="space-y-2 text-sm">
                  <Detail
                    label="Driver"
                    value={state.drivers.find((d) => d.id === selectedVehicle.driverId)?.name ?? '—'}
                  />
                  <Detail label="Pickups today" value={String(selectedVehicle.completedToday)} />
                  <Detail label="Load capacity" value={`${selectedVehicle.capacityPct}%`} />
                </dl>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
                    Assigned stops
                  </p>
                  <ul className="space-y-2">
                    {vehicleStops.map((t) => {
                      const b = state.bins.find((x) => x.id === t.binId)
                      return (
                        <li key={t.id} className="flex items-center justify-between text-sm">
                          <span className="text-ink-700">
                            {t.sequence}. {b?.code} · {b?.zone}
                          </span>
                          <span className="capitalize text-ink-400">{t.status}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <Button variant="outline" className="w-full" onClick={() => navigate('/admin/vehicles')}>
                  Open fleet view
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Operational alerts"
            subtitle="Critical and warning events requiring attention"
            action={<Badge tone={openAlerts > 0 ? 'critical' : 'success'}>{openAlerts} open</Badge>}
          />
          <div className="mt-4">
            <AlertsPanel alerts={state.alerts} />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Activity feed"
            subtitle="Live operations log"
            action={<Activity className="h-4 w-4 text-ink-400" />}
          />
          <div className="mt-4">
            <ActivityFeed events={state.activity} limit={7} />
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={() => {
          resetDemo()
          setAutoRun(false)
          setSelectedBinId(null)
          setSelectedVehicleId(null)
          pushToast({ variant: 'info', title: 'Demo data reset', description: 'State restored to the seed snapshot.' })
          setConfirmReset(false)
        }}
        title="Reset demo data?"
        description="This restores the original seed state: bins, alerts, tasks, points and activity. Any progress you made in this demo will be lost."
        confirmLabel="Reset demo"
        variant="danger"
      />
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-medium capitalize text-ink-800">{value}</dd>
    </div>
  )
}

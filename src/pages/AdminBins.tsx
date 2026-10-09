import { BellOff, Info, Recycle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useApp } from '@/store/AppContext'
import { BIN_THRESHOLDS, type BinStatus, type WasteBin } from '@/types'
import { formatRelativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge, BinStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SearchInput, Select } from '@/components/ui/Input'
import { Dialog } from '@/components/ui/Dialog'
import { EmptyState } from '@/components/ui/EmptyState'

type SortKey = 'fill-desc' | 'zone' | 'updated'

export function AdminBins() {
  const { state, acknowledgeAlert, pushToast } = useApp()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | BinStatus>('all')
  const [sort, setSort] = useState<SortKey>('fill-desc')
  const [detailBin, setDetailBin] = useState<WasteBin | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = state.bins.filter((b) => {
      const matchesQuery =
        !q || b.code.toLowerCase().includes(q) || b.zone.toLowerCase().includes(q) || b.category.includes(q)
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter
      return matchesQuery && matchesStatus
    })
    return [...list].sort((a, b) => {
      if (sort === 'fill-desc') return b.fill - a.fill
      if (sort === 'zone') return a.zone.localeCompare(b.zone)
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    })
  }, [state.bins, query, statusFilter, sort])

  const alertForBin = (binId: string) =>
    state.alerts.find((a) => a.binId === binId && a.status !== 'resolved') ?? null

  const counts = {
    critical: state.bins.filter((b) => b.status === 'critical').length,
    attention: state.bins.filter((b) => b.status === 'attention').length,
    normal: state.bins.filter((b) => b.status === 'normal').length,
    collected: state.bins.filter((b) => b.status === 'collected').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-display uppercase tracking-tight text-ink-900">Bin Monitoring</h2>
          <p className="text-sm text-ink-600">
            Thresholds — Attention ≥ {BIN_THRESHOLDS.attention}% · Critical ≥ {BIN_THRESHOLDS.critical}%
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="critical">{counts.critical} critical</Badge>
          <Badge tone="warning">{counts.attention} attention</Badge>
          <Badge tone="success">{counts.normal} normal</Badge>
          <Badge tone="info">{counts.collected} collected</Badge>
        </div>
      </div>

      <Card padded={false}>
        <div className="flex flex-wrap items-center gap-3 border-b-2 border-ink-900/20 p-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search bin ID, zone or type…"
            className="w-full sm:w-72"
          />
          <Select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | BinStatus)}
            className="w-full sm:w-44"
          >
            <option value="all">All statuses</option>
            <option value="normal">Normal</option>
            <option value="attention">Attention</option>
            <option value="critical">Critical</option>
            <option value="collected">Collected</option>
          </Select>
          <Select
            aria-label="Sort bins"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="w-full sm:w-52"
          >
            <option value="fill-desc">Sort: Highest fill</option>
            <option value="zone">Sort: Zone A–Z</option>
            <option value="updated">Sort: Recently updated</option>
          </Select>
          <span className="ml-auto text-sm text-ink-500">{filtered.length} bins</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Recycle}
              title="No bins match your filters"
              description="Try clearing the search or selecting a different status."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setStatusFilter('all')
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-ink-900/20 text-left text-[11px] font-bold uppercase tracking-wider text-ink-600">
                  <th className="px-4 py-3">Bin</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Fill level</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const alert = alertForBin(b.id)
                  const vehicle = state.vehicles.find((v) => v.id === b.assignedVehicleId)
                  return (
                    <tr key={b.id} className="border-b-2 border-ink-900/10 last:border-0 hover:bg-paper">
                      <td className="px-4 py-3 font-medium text-ink-800">{b.code}</td>
                      <td className="px-4 py-3 text-ink-600">{b.zone}</td>
                      <td className="px-4 py-3 capitalize text-ink-600">{b.category}</td>
                      <td className="px-4 py-3">
                        <ProgressBar value={b.fill} status={b.status} showLabel className="w-40" />
                      </td>
                      <td className="px-4 py-3">
                        <BinStatusBadge status={b.status} />
                      </td>
                      <td className="px-4 py-3 text-ink-600">{formatRelativeTime(b.lastUpdated)}</td>
                      <td className="px-4 py-3 text-ink-600">{vehicle?.code ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {alert && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                acknowledgeAlert(alert.id)
                                pushToast({ variant: 'info', title: 'Alert acknowledged', description: alert.title })
                              }}
                            >
                              <BellOff className="h-3.5 w-3.5" /> Ack
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => setDetailBin(b)} aria-label={`Details for ${b.code}`}>
                            <Info className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog
        open={detailBin !== null}
        onClose={() => setDetailBin(null)}
        title={detailBin?.code ?? ''}
        description={`${detailBin?.label ?? ''} · ${detailBin?.zone ?? ''}`}
      >
        {detailBin && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <BinStatusBadge status={detailBin.status} />
              <span className="text-lg font-semibold tabular-nums text-ink-800">
                {Math.round(detailBin.fill)}%
              </span>
            </div>
            <ProgressBar value={detailBin.fill} status={detailBin.status} />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600">Waste type</dt>
                <dd className="font-medium capitalize text-ink-800">{detailBin.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Last updated</dt>
                <dd className="font-medium text-ink-800">{formatRelativeTime(detailBin.lastUpdated)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Assigned vehicle</dt>
                <dd className="font-medium text-ink-800">
                  {state.vehicles.find((v) => v.id === detailBin.assignedVehicleId)?.code ?? 'Unassigned'}
                </dd>
              </div>
            </dl>
            {alertForBin(detailBin.id) && (
              <div className="rounded-xl border-2 border-ink-900 bg-tone-danger p-3 text-sm font-semibold text-[#d90429] shadow-brutal-sm">
                {alertForBin(detailBin.id)?.message}
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  )
}

import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import type { CollectionVehicle, PickupTask, WasteBin } from '@/types'

const statusFill: Record<WasteBin['status'], string> = {
  normal: '#10b981',
  attention: '#f59e0b',
  critical: '#e11d48',
  collected: '#3b82f6',
}

const ZONES: Array<{ label: string; x: number; y: number; w: number; h: number }> = [
  { label: 'Hostels', x: 10, y: 8, w: 30, h: 24 },
  { label: 'Academic', x: 48, y: 8, w: 40, h: 24 },
  { label: 'Central Campus', x: 30, y: 36, w: 40, h: 30 },
  { label: 'Sports & Garden', x: 62, y: 70, w: 30, h: 22 },
  { label: 'Entrance', x: 6, y: 66, w: 22, h: 26 },
]

export function CampusMap({
  bins,
  vehicles,
  tasks,
  selectedId,
  onSelectBin,
  onSelectVehicle,
  showRoutes = true,
  className,
}: {
  bins: WasteBin[]
  vehicles: CollectionVehicle[]
  tasks: PickupTask[]
  selectedId: string | null
  onSelectBin: (id: string) => void
  onSelectVehicle: (id: string) => void
  showRoutes?: boolean
  className?: string
}) {
  const routes = useMemo(() => {
    return vehicles
      .map((v) => {
        const stops = tasks
          .filter((t) => t.vehicleId === v.id)
          .sort((a, b) => a.sequence - b.sequence)
          .map((t) => bins.find((b) => b.id === t.binId))
          .filter((b): b is WasteBin => Boolean(b))
        return { vehicleId: v.id, color: v.status === 'active' ? '#2563eb' : '#94a3b8', stops }
      })
      .filter((r) => r.stops.length > 1)
  }, [vehicles, tasks, bins])

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-ink-100 bg-[#f1f7f3]', className)}>
      <svg viewBox="0 0 100 100" className="h-full max-h-[440px] w-full" role="img" aria-label="Campus operations map">
        <defs>
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#dbe7df" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {ZONES.map((z) => (
          <g key={z.label}>
            <rect
              x={z.x}
              y={z.y}
              width={z.w}
              height={z.h}
              rx="3"
              fill="#ffffff"
              opacity="0.72"
              stroke="#cfe0d6"
              strokeWidth="0.4"
            />
            <text x={z.x + 1.6} y={z.y + 4} fontSize="2.4" fill="#7a8783" fontWeight="600">
              {z.label}
            </text>
          </g>
        ))}

        <path
          d="M8 70 Q30 60 45 52 T92 40"
          fill="none"
          stroke="#c8d6ce"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M20 12 Q40 40 52 52 T88 78"
          fill="none"
          stroke="#c8d6ce"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {showRoutes &&
          routes.map((r) => (
            <polyline
              key={r.vehicleId}
              points={r.stops.map((s) => `${s.x},${s.y}`).join(' ')}
              fill="none"
              stroke={r.color}
              strokeWidth="0.7"
              strokeDasharray="2 1.4"
              strokeLinecap="round"
              opacity="0.85"
            />
          ))}

        {bins.map((b) => {
          const selected = b.id === selectedId
          return (
            <g
              key={b.id}
              role="button"
              tabIndex={0}
              aria-label={`Bin ${b.code} at ${b.zone}, ${Math.round(b.fill)}% full, ${b.status}`}
              onClick={() => onSelectBin(b.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectBin(b.id)
                }
              }}
              className="cursor-pointer"
            >
              {b.status === 'critical' && (
                <circle cx={b.x} cy={b.y} r={3} fill={statusFill.critical} opacity="0.35">
                  <animate attributeName="r" values="2.2;4.6;2.2" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={b.x}
                cy={b.y}
                r={selected ? 2.9 : 2.2}
                fill={statusFill[b.status]}
                stroke={selected ? '#0f1412' : '#ffffff'}
                strokeWidth={selected ? 0.7 : 0.5}
              />
              <title>{`${b.code} — ${b.zone} (${Math.round(b.fill)}%)`}</title>
            </g>
          )
        })}

        {vehicles.map((v) => (
          <g
            key={v.id}
            role="button"
            tabIndex={0}
            aria-label={`Vehicle ${v.code}, ${v.status}`}
            onClick={() => onSelectVehicle(v.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectVehicle(v.id)
              }
            }}
            className="cursor-pointer"
          >
            <rect
              x={v.x - 3}
              y={v.y - 2.4}
              width="6"
              height="4.8"
              rx="1.2"
              fill={v.status === 'active' ? '#1d4ed8' : v.status === 'returning' ? '#7c3aed' : '#475569'}
              stroke="#ffffff"
              strokeWidth="0.5"
            />
            <text x={v.x} y={v.y + 0.9} fontSize="2.2" fill="#ffffff" textAnchor="middle" fontWeight="700">
              {v.code.replace('GP-', '')}
            </text>
            <title>{`${v.code} — ${v.status}`}</title>
          </g>
        ))}
      </svg>

      <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1.5 rounded-xl border border-ink-100 bg-surface/95 px-3 py-2 text-[11px] font-medium text-ink-600 shadow-card backdrop-blur">
        <Legend color={statusFill.normal} label="Normal" />
        <Legend color={statusFill.attention} label="Attention" />
        <Legend color={statusFill.critical} label="Critical" />
        <Legend color={statusFill.collected} label="Collected" />
        <Legend color="#1d4ed8" label="Vehicle" square />
      </div>
    </div>
  )
}

function Legend({ color, label, square = false }: { color: string; label: string; square?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn('inline-block h-2.5 w-2.5', square ? 'rounded-[3px]' : 'rounded-full')}
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  )
}

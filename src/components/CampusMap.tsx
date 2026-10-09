import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import type { CollectionVehicle, PickupTask, WasteBin } from '@/types'

declare global {
  interface Window {
    google?: {
      maps?: {
        Map: new (el: HTMLElement, opts: Record<string, unknown>) => GoogleMapInstance
        Circle: new (opts: Record<string, unknown>) => GoogleMapOverlay
        Marker: new (opts: Record<string, unknown>) => GoogleMapOverlay
        Polyline: new (opts: Record<string, unknown>) => GoogleMapOverlay
        Point: new (x: number, y: number) => { x: number; y: number }
      }
    }
    initMap?: () => void
  }
}

interface GoogleMapOverlay {
  setMap(map: GoogleMapInstance | null): void
  addListener(event: string, callback: () => void): void
}

interface GoogleMapInstance {
  setOptions(options: Record<string, unknown>): void
}

const statusFill: Record<WasteBin['status'], string> = {
  normal: '#00c853',
  attention: '#ffb800',
  critical: '#ff3b3b',
  collected: '#00c2c8',
}

const MAP_SCRIPT =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly'
const MAP_LOAD_TIMEOUT_MS = 12000

const CAMPUS_CENTER = { lat: 18.49259, lng: 74.025483 }
const NORTH = CAMPUS_CENTER.lat + 0.0035
const WEST = CAMPUS_CENTER.lng - 0.0042
const LAT_SPAN = 0.007
const LNG_SPAN = 0.0085

const MAP_STYLE = [
  { featureType: 'poi.business', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#57534e' }] },
]

let keylessPromise: Promise<boolean> | null = null

function loadKeylessMaps(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.google?.maps) return Promise.resolve(true)
  if (keylessPromise) return keylessPromise
  keylessPromise = new Promise((resolve) => {
    window.initMap = () => {
      window.initMap = undefined
      resolve(true)
    }
    const timer = window.setTimeout(() => resolve(false), MAP_LOAD_TIMEOUT_MS)
    const script = document.createElement('script')
    script.src = MAP_SCRIPT
    script.async = true
    script.defer = true
    script.onerror = () => {
      window.clearTimeout(timer)
      resolve(false)
    }
    document.head.appendChild(script)
  })
  return keylessPromise
}

function project(x: number, y: number): { lat: number; lng: number } {
  return { lat: NORTH - (y / 100) * LAT_SPAN, lng: WEST + (x / 100) * LNG_SPAN }
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
  const [mode, setMode] = useState<'svg' | 'gmaps'>('svg')
  const mapElRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<GoogleMapInstance | null>(null)
  const overlaysRef = useRef<GoogleMapOverlay[]>([])

  const routes = useMemo(() => {
    return vehicles
      .map((v) => {
        const stops = tasks
          .filter((t) => t.vehicleId === v.id)
          .sort((a, b) => a.sequence - b.sequence)
          .map((t) => bins.find((b) => b.id === t.binId))
          .filter((b): b is WasteBin => Boolean(b))
        return { vehicleId: v.id, color: v.status === 'active' ? '#064e3b' : '#78716c', stops }
      })
      .filter((r) => r.stops.length > 1)
  }, [vehicles, tasks, bins])

  useEffect(() => {
    let cancelled = false
    loadKeylessMaps().then((ok) => {
      if (!cancelled && ok && window.google?.maps?.Map) setMode('gmaps')
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (mode !== 'gmaps' || !window.google?.maps || !mapElRef.current) return
    const gmaps = window.google.maps
    if (mapInstance.current) return
    mapInstance.current = new gmaps.Map(mapElRef.current, {
      center: CAMPUS_CENTER,
      zoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      styles: MAP_STYLE,
    })
    return () => {
      overlaysRef.current.forEach((o) => o.setMap(null))
      overlaysRef.current = []
      mapInstance.current = null
    }
  }, [mode])

  useEffect(() => {
    const map = mapInstance.current
    if (!map || !window.google?.maps) return
    const gmaps = window.google.maps

    overlaysRef.current.forEach((o) => o.setMap(null))
    overlaysRef.current = []

    if (showRoutes) {
      routes.forEach((r) => {
        const path = r.stops.map((s) => project(s.x, s.y))
        if (path.length < 2) return
        const polyline = new gmaps.Polyline({
          map,
          path,
          strokeColor: r.color,
          strokeOpacity: 0.85,
          strokeWeight: 3,
          zIndex: 40,
        })
        overlaysRef.current.push(polyline)
      })
    }

    bins.forEach((b) => {
      const center = project(b.x, b.y)
      const isSelected = b.id === selectedId
      if (b.status === 'critical' || isSelected) {
        const ring = new gmaps.Circle({
          map,
          center,
          radius: isSelected ? 30 : 26,
          fillColor: statusFill[b.status],
          fillOpacity: isSelected ? 0.2 : 0.12,
          strokeColor: isSelected ? '#0d1117' : statusFill[b.status],
          strokeWeight: isSelected ? 3 : 1,
          strokeOpacity: 0.6,
          zIndex: 45,
        })
        overlaysRef.current.push(ring)
      }
      const marker = new gmaps.Circle({
        map,
        center,
        radius: 16,
        fillColor: statusFill[b.status],
        fillOpacity: 1,
        strokeColor: '#0d1117',
        strokeWeight: 2,
        cursor: 'pointer',
        clickable: true,
        zIndex: 50,
        title: `${b.code} — ${b.zone} (${Math.round(b.fill)}%)`,
      })
      marker.addListener('click', () => onSelectBin(b.id))
      overlaysRef.current.push(marker)
    })

    vehicles.forEach((v) => {
      const pos = project(v.x, v.y)
      const short = v.code.replace('GP-V', 'V')
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">` +
        `<rect x="3" y="3" width="24" height="24" rx="5" fill="${v.status === 'active' ? '#064e3b' : '#57534e'}" stroke="#0d1117" stroke-width="2.5"/>` +
        `<text x="15" y="19" font-family="Arial, sans-serif" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle">${short}</text></svg>`
      const marker = new gmaps.Marker({
        map,
        position: pos,
        icon: {
          url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
          anchor: new gmaps.Point(15, 15),
        },
        cursor: 'pointer',
        zIndex: 60,
        title: `${v.code} — ${v.status}`,
      })
      marker.addListener('click', () => onSelectVehicle(v.id))
      overlaysRef.current.push(marker)
    })
  }, [mode, bins, vehicles, routes, tasks, selectedId, onSelectBin, onSelectVehicle, showRoutes])

  return (
    <div className={cn('relative overflow-hidden rounded-xl border-2 border-ink-900', mode === 'gmaps' ? 'bg-ink-950' : 'bg-[#f1efe4]', className)}>
      {mode === 'gmaps' ? (
        <div
          ref={mapElRef}
          className="h-full w-full max-h-[440px]"
          role="region"
          aria-label="Campus operations map"
        />
      ) : (
        <svg viewBox="0 0 100 100" className="h-full max-h-[440px] w-full" role="img" aria-label="Campus operations map">
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#e3ddc5" strokeWidth="0.3" />
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
                rx="2"
                fill="#ffffff"
                opacity="0.85"
                stroke="#8c8683"
                strokeWidth="0.5"
              />
              <text x={z.x + 1.6} y={z.y + 4} fontSize="2.4" fill="#57534e" fontWeight="700">
                {z.label}
              </text>
            </g>
          ))}

          <path
            d="M8 70 Q30 60 45 52 T92 40"
            fill="none"
            stroke="#c8c1a8"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M20 12 Q40 40 52 52 T88 78"
            fill="none"
            stroke="#c8c1a8"
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
                  stroke={selected ? '#0d1117' : '#ffffff'}
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
                fill={v.status === 'active' ? '#064e3b' : v.status === 'returning' ? '#00c2c8' : '#57534e'}
                stroke="#ffffff"
                strokeWidth="0.5"
              />
              <text x={v.x} y={v.y + 0.9} fontSize="2.2" fill="#ffffff" textAnchor="middle" fontWeight="700">
                {v.code.replace('GP-V', 'V')}
              </text>
              <title>{`${v.code} — ${v.status}`}</title>
            </g>
          ))}
        </svg>
      )}

      <div className="absolute bottom-3 left-3 z-[100] flex flex-wrap gap-x-3 gap-y-1.5 rounded-lg border-2 border-ink-900 bg-surface px-3 py-2 text-[11px] font-bold text-ink-700 shadow-brutal-sm">
        <Legend color={statusFill.normal} label="Normal" />
        <Legend color={statusFill.attention} label="Attention" />
        <Legend color={statusFill.critical} label="Critical" />
        <Legend color={statusFill.collected} label="Collected" />
        <Legend color="#064e3b" label="Vehicle" square />
      </div>
    </div>
  )
}

function Legend({ color, label, square = false }: { color: string; label: string; square?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn('inline-block h-2.5 w-2.5 border border-ink-900', square ? 'rounded-[3px]' : 'rounded-full')}
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  )
}
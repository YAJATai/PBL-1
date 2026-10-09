import {
  BellRing,
  CheckCircle2,
  Gift,
  MapPin,
  Recycle,
  Route as RouteIcon,
  Sprout,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/format'
import type { ActivityEvent, ActivityKind } from '@/types'

const config: Record<ActivityKind, { icon: LucideIcon; tone: string }> = {
  submission: { icon: Recycle, tone: 'bg-tone-success text-[#007a3d]' },
  'bin-threshold': { icon: BellRing, tone: 'bg-tone-danger text-[#d90429]' },
  'route-assigned': { icon: RouteIcon, tone: 'bg-tone-teal text-[#006e73]' },
  'driver-arrived': { icon: MapPin, tone: 'bg-tone-yellow text-ink-900' },
  'pickup-completed': { icon: CheckCircle2, tone: 'bg-tone-success text-[#007a3d]' },
  'alert-resolved': { icon: CheckCircle2, tone: 'bg-paper text-ink-600' },
  'reward-redeemed': { icon: Gift, tone: 'bg-tone-magenta text-[#b800b8]' },
  simulation: { icon: Sprout, tone: 'bg-paper text-ink-600' },
}

export function ActivityFeed({ events, limit = 8 }: { events: ActivityEvent[]; limit?: number }) {
  const shown = events.slice(0, limit)
  return (
    <ol className="space-y-3">
      {shown.map((event) => {
        const { icon: Icon, tone } = config[event.kind]
        return (
          <li key={event.id} className="flex gap-3">
            <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-ink-900', tone)}>
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-sm text-ink-700">{event.message}</p>
              <p className="mt-0.5 text-xs text-ink-400">
                {event.actor} · {formatRelativeTime(event.createdAt)}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
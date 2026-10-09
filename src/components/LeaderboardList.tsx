import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'
import { rankStudents, type RankMetric } from '@/lib/ranking'
import type { Student } from '@/types'

const rankTone = (rank: number) =>
  rank === 1
    ? 'bg-amber-100 text-amber-800'
    : rank === 2
      ? 'bg-ink-100 text-ink-700'
      : rank === 3
        ? 'bg-orange-100 text-orange-800'
        : 'bg-surface-sunken text-ink-500'

function PointsCell({ student, metric }: { student: Student; metric: RankMetric }) {
  const value = metric === 'weeklyPoints' ? student.weeklyPoints : student.points
  return (
    <span className="text-sm font-semibold tabular-nums text-ink-900">
      {formatNumber(value)}
      {metric === 'weeklyPoints' && <span className="ml-1 text-xs font-normal text-ink-400">/wk</span>}
    </span>
  )
}

export function LeaderboardList({
  students,
  currentStudentId,
  metric = 'points',
  limit,
}: {
  students: Student[]
  currentStudentId: string
  metric?: RankMetric
  limit?: number
}) {
  const ranked = rankStudents(students, metric)
  const shown = limit ? ranked.slice(0, limit) : ranked
  const current = ranked.find((s) => s.id === currentStudentId)

  return (
    <div className="space-y-1.5">
      {shown.map((s) => {
        const isCurrent = s.id === currentStudentId
        return (
          <div
            key={s.id}
            className={cn(
              'flex items-center gap-3 rounded-xl border px-3 py-2.5',
              isCurrent ? 'border-brand-200 bg-brand-50' : 'border-transparent hover:bg-surface-muted',
            )}
          >
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums',
                rankTone(s.rank),
              )}
            >
              {s.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-800">
                {s.name}
                {isCurrent && <span className="ml-2 text-xs font-semibold text-brand-700">You</span>}
              </p>
              <p className="text-xs text-ink-400">
                {s.hostel} · {s.submissions} submissions
              </p>
            </div>
            <div className="text-right">
              <PointsCell student={s} metric={metric} />
              <span
                className={cn(
                  'mt-0.5 inline-flex items-center gap-0.5 text-[11px] font-medium',
                  s.movement > 0 ? 'text-brand-600' : s.movement < 0 ? 'text-rose-600' : 'text-ink-400',
                )}
              >
                {s.movement > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : s.movement < 0 ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
                {s.movement === 0 ? '—' : Math.abs(s.movement)}
              </span>
            </div>
          </div>
        )
      })}
      {limit && current && current.rank > limit && (
        <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-xs font-bold text-brand-800">
            {current.rank}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink-800">{current.name} (You)</p>
            <p className="text-xs text-ink-400">
              {formatNumber(metric === 'weeklyPoints' ? current.weeklyPoints : current.points)} points
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'
import { rankStudents, type RankMetric } from '@/lib/ranking'
import type { Student } from '@/types'

const rankTone = (rank: number) =>
  rank === 1
    ? 'bg-neon-gold text-ink-950 border-ink-900 shadow-brutal-sm'
    : rank === 2
      ? 'bg-ink-100 text-ink-900 border-ink-900'
      : rank === 3
        ? 'bg-tone-teal text-[#006e73] border-ink-900'
        : 'bg-paper text-ink-600 border-ink-900'

function PointsCell({ student, metric }: { student: Student; metric: RankMetric }) {
  const value = metric === 'weeklyPoints' ? student.weeklyPoints : student.points
  return (
    <span className="text-sm font-bold tabular-nums text-ink-900">
      {formatNumber(value)}
      {metric === 'weeklyPoints' && <span className="ml-1 text-xs font-normal text-ink-500">/wk</span>}
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
              'flex items-center gap-3 rounded-lg border-2 px-3 py-2.5',
              isCurrent ? 'border-ink-900 bg-tone-yellow shadow-brutal-sm' : 'border-transparent hover:bg-paper',
            )}
          >
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold tabular-nums',
                rankTone(s.rank),
              )}
            >
              {s.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-800">
                {s.name}
                {isCurrent && (
                  <span className="ml-2 rounded-md border-2 border-ink-900 bg-ink-900 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                    You
                  </span>
                )}
              </p>
<p className="text-xs text-ink-500">
                {s.hostel} · {s.submissions} submissions
              </p>
            </div>
            <div className="text-right">
              <PointsCell student={s} metric={metric} />
              <span
                className={cn(
                  'mt-0.5 inline-flex items-center gap-0.5 text-[11px] font-bold',
                  s.movement > 0 ? 'text-status-normal' : s.movement < 0 ? 'text-status-critical' : 'text-ink-500',
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
        <div className="flex items-center gap-3 rounded-lg border-2 border-ink-900 bg-tone-yellow px-3 py-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-ink-900 bg-neon-gold text-xs font-bold text-ink-950">
            {current.rank}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink-800">{current.name} (You)</p>
            <p className="text-xs text-ink-500">
              {formatNumber(metric === 'weeklyPoints' ? current.weeklyPoints : current.points)} points
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
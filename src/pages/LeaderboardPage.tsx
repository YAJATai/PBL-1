import { Trophy } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/store/AppContext'
import { rankStudents, type RankMetric } from '@/lib/ranking'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LeaderboardList } from '@/components/LeaderboardList'

const FILTERS: Array<{ key: RankMetric; label: string }> = [
  { key: 'weeklyPoints', label: 'This week' },
  { key: 'points', label: 'All time' },
]

export function LeaderboardPage() {
  const { state } = useApp()
  const student = state.students.find((s) => s.id === state.currentStudentId)!
  const [metric, setMetric] = useState<RankMetric>('points')
  const ranked = rankStudents(state.students, metric)
  const myRank = ranked.find((s) => s.id === student.id)!
  const podium = ranked.slice(0, 3)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink-900">Campus Leaderboard</h2>
          <p className="text-sm text-ink-500">Rankings are derived from the same points data as your dashboard.</p>
        </div>
        <div className="flex rounded-xl border border-ink-200 bg-surface p-1" role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={metric === f.key}
              onClick={() => setMetric(f.key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                metric === f.key ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-surface-muted',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {podium.map((p, i) => (
          <Card
            key={p.id}
            className={cn(
              'text-center',
              i === 0 && 'border-amber-200 bg-gradient-to-b from-amber-50 to-surface',
            )}
          >
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken text-sm font-bold text-ink-700">
              {p.rank}
            </span>
            <p className="mt-3 text-sm font-semibold text-ink-900">{p.name}</p>
            <p className="text-xs text-ink-400">{p.hostel}</p>
            <p className="mt-2 text-lg font-semibold tabular-nums text-brand-700">
              {formatNumber(metric === 'weeklyPoints' ? p.weeklyPoints : p.points)}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title={metric === 'weeklyPoints' ? 'This week' : 'All time'}
            subtitle={`${state.students.length} participants`}
            action={<Badge tone="brand" dot>Live demo state</Badge>}
          />
          <div className="mt-4">
            <LeaderboardList students={state.students} currentStudentId={student.id} metric={metric} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Your standing" subtitle={`Rank #${myRank.rank}`} />
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-center rounded-xl bg-brand-50 py-6 text-brand-700">
              <Trophy className="mr-2 h-6 w-6" />
              <span className="text-3xl font-semibold tabular-nums">#{myRank.rank}</span>
            </div>
            <Row label="Name" value={student.name} />
            <Row label="GreenPoints" value={formatNumber(student.points)} />
            <Row label="This week" value={formatNumber(student.weeklyPoints)} />
            <Row label="Verified disposals" value={formatNumber(student.submissions)} />
            <Row
              label="Movement"
              value={myRank.movement === 0 ? 'No change' : `${myRank.movement > 0 ? '↑' : '↓'} ${Math.abs(myRank.movement)}`}
            />
          </div>
          <Link
            to="/student/scan"
            className="mt-5 flex h-10 w-full items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Scan to earn more points
          </Link>
        </Card>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-100 pb-2.5 last:border-0">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-medium tabular-nums text-ink-800">{value}</span>
    </div>
  )
}

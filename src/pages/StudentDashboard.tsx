import {
  ArrowRight,
  Coins,
  Leaf,
  QrCode,
  Recycle,
  Scale,
  ShoppingBag,
  Trophy,
  Wind,
} from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useApp } from '@/store/AppContext'
import { getRankFor } from '@/lib/ranking'
import { CATEGORY_LABELS, CATEGORY_TONE } from '@/lib/category'
import { formatKg, formatNumber, formatRelativeTime } from '@/lib/format'
import { Card, CardHeader } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/Metric'
import { Badge } from '@/components/ui/Badge'
import { DemoBadge } from '@/components/ui/DemoBadge'
import { LeaderboardList } from '@/components/LeaderboardList'

function last7Days() {
  const days: Array<{ key: string; label: string; date: Date }> = []
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d,
    })
  }
  return days
}

export function StudentDashboard() {
  const { state } = useApp()
  const student = state.students.find((s) => s.id === state.currentStudentId)!
  const rank = getRankFor(state.students, student.id)

  const mySubmissions = useMemo(
    () =>
      state.submissions
        .filter((s) => s.studentId === student.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [state.submissions, student.id],
  )

  const impact = useMemo(() => {
    const weight = mySubmissions.reduce((sum, s) => sum + s.weightKg, 0)
    const co2 = mySubmissions.reduce((sum, s) => sum + s.co2SavedKg, 0)
    return { weight, co2 }
  }, [mySubmissions])

  const weekly = useMemo(() => {
    const days = last7Days()
    return days.map((d) => {
      const points = state.submissions
        .filter((s) => s.studentId === student.id && s.createdAt.slice(0, 10) === d.key)
        .reduce((sum, s) => sum + s.points, 0)
      return { day: d.label, points }
    })
  }, [state.submissions, student.id])

  const recent = mySubmissions.slice(0, 5)
  const topRewards = state.rewards.slice(0, 3)

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-ink-900 bg-[#064e3b] text-white shadow-card">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-lg border-4 border-white/15" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neon-gold">Welcome back,</p>
            <h2 className="mt-1 text-2xl font-display uppercase tracking-tight sm:text-3xl">{student.name}</h2>
            <p className="mt-1.5 text-sm text-white/70">
              {student.hostel} · Rank #{rank} on campus
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/student/scan"
                className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-ink-900 bg-neon-teal px-5 text-sm font-bold uppercase tracking-wide text-ink-950 shadow-card transition hover:-translate-y-0.5 hover:shadow-raised"
              >
                <QrCode className="h-4 w-4" /> Scan &amp; Earn
              </Link>
              <Link
                to="/student/market"
                className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                <ShoppingBag className="h-4 w-4" /> Open Market
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:w-72">
            <div className="rounded-xl border-2 border-white/25 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-white/70">
                <Coins className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wide">Balance</span>
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums text-neon-teal">{formatNumber(student.points)}</p>
              <p className="text-xs text-white/60">GreenPoints</p>
            </div>
            <div className="rounded-xl border-2 border-white/25 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-white/70">
                <Trophy className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wide">Campus rank</span>
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums text-neon-gold">#{rank}</p>
              <p className="text-xs text-white/60">of {state.students.length} students</p>
            </div>
          </div>
        </div>
      </Card>

      <section aria-label="Impact metrics">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">Your impact</h2>
          <DemoBadge label="Estimated demo metrics" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="GreenPoints balance"
            value={formatNumber(student.points)}
            hint="Redeemable across campus rewards"
            icon={Coins}
            tone="brand"
          />
          <MetricCard
            label="Submissions logged"
            value={formatNumber(student.submissions)}
            hint="Verified responsible disposals"
            icon={Recycle}
            tone="blue"
          />
          <MetricCard
            label="Waste diverted"
            value={formatKg(impact.weight)}
            hint="Estimated from logged submission weights"
            icon={Scale}
            tone="ink"
          />
          <MetricCard
            label="Est. CO₂ avoided"
            value={`${impact.co2.toFixed(1)} kg`}
            hint="Demo factor: 0.30 / 0.08 / 0.05 kg CO₂e per kg by category"
            icon={Wind}
            tone="brand"
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Weekly activity"
            subtitle="GreenPoints earned from submitted disposals this week"
          />
          <div className="mt-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd6bc" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#57534e' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#57534e' }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,194,200,0.1)' }}
                  contentStyle={{
                    borderRadius: 10,
                    border: '2px solid #0d1117',
                    boxShadow: '4px 4px 0 #0d1117',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  formatter={(value: number) => [`${value} pts`, 'Points']}
                />
                <Bar dataKey="points" radius={[4, 4, 0, 0]} maxBarSize={44}>
                  {weekly.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.points > 0 ? '#00c2c8' : '#ddd6bc'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Recent activity"
            subtitle="Your latest logged submissions"
            action={
              <Link to="/student/scan" className="text-sm font-bold uppercase tracking-wide text-ink-900 hover:text-ink-600">
                Scan
              </Link>
            }
          />
          <ul className="mt-4 space-y-3">
            {recent.length === 0 && (
              <li className="rounded-xl bg-surface-muted p-4 text-sm text-ink-500">
                No submissions yet. Scan a bin to start earning.
              </li>
            )}
            {recent.map((s) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink-900 bg-tone-success text-[#007a3d]">
                  <Leaf className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-ink-800">
                      {CATEGORY_LABELS[s.category]}
                    </p>
                    <Badge tone={CATEGORY_TONE[s.category]} className="!px-2 !py-0.5">
                      {s.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-ink-500">
                    {s.zone} · {formatRelativeTime(s.createdAt)}
                  </p>
                </div>
                <span className="text-sm font-bold tabular-nums text-ink-900">+{s.points}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card id="rewards" className="relative overflow-hidden border-ink-950 bg-ink-900 text-white shadow-card xl:col-span-2">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-lg border-4 border-white/10" aria-hidden />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-neon-gold">Black Market</p>
              <h3 className="mt-1 text-xl font-display uppercase tracking-wide text-white">Spend your GreenPoints</h3>
              <p className="mt-1.5 max-w-md text-sm text-white/70">
                Trade points for café vouchers, sustainable merch and more from the campus Black Market.
              </p>
              <Link
                to="/student/market"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl border-2 border-ink-900 bg-neon-teal px-5 text-sm font-bold uppercase tracking-wide text-ink-950 shadow-card transition hover:-translate-y-0.5 hover:shadow-raised"
              >
                <ShoppingBag className="h-4 w-4" /> Shop now
              </Link>
            </div>
            <ul className="grid w-full gap-2 sm:grid-cols-3 lg:w-auto">
              {topRewards.map((r) => (
                <li key={r.id} className="rounded-xl border-2 border-white/20 bg-white/10 p-3">
                  <p className="truncate text-xs font-bold uppercase tracking-wide text-white/80">{r.title}</p>
                  <p className="mt-1 font-display text-sm tabular-nums text-neon-teal">{formatNumber(r.cost)} GP</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Campus leaderboard"
            subtitle="Top performers this season"
            action={
              <Link
                to="/student/leaderboard"
                className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-ink-900 hover:text-ink-600"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="mt-4">
            <LeaderboardList students={state.students} currentStudentId={student.id} limit={5} />
          </div>
        </Card>
      </div>
    </div>
  )
}

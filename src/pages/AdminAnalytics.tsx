import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useApp } from '@/store/AppContext'
import { CATEGORY_LABELS } from '@/lib/category'
import { formatNumber } from '@/lib/format'
import { Card, CardHeader } from '@/components/ui/Card'
import { Select } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { DemoBadge } from '@/components/ui/DemoBadge'
import type { WasteCategory } from '@/types'

const CATEGORY_COLORS: Record<WasteCategory, string> = {
  recyclable: '#10b981',
  organic: '#f59e0b',
  general: '#3b82f6',
}

function rangeDays(range: string): number {
  if (range === '30') return 30
  if (range === '14') return 14
  return 7
}

export function AdminAnalytics() {
  const { state } = useApp()
  const [range, setRange] = useState('7')
  const days = rangeDays(range)

  const volume = useMemo(() => {
    const buckets: Array<{ label: string; kg: number; count: number }> = []
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const subs = state.submissions.filter((s) => s.createdAt.slice(0, 10) === key)
      buckets.push({
        label: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        kg: Number(subs.reduce((sum, s) => sum + s.weightKg, 0).toFixed(1)),
        count: subs.length,
      })
    }
    return buckets
  }, [state.submissions, days])

  const distribution = useMemo(() => {
    const cats: WasteCategory[] = ['recyclable', 'organic', 'general']
    return cats.map((c) => ({
      name: CATEGORY_LABELS[c],
      value: state.submissions.filter((s) => s.category === c).length,
      color: CATEGORY_COLORS[c],
    }))
  }, [state.submissions])

  const completion = useMemo(() => {
    const total = state.tasks.length
    const done = state.tasks.filter((t) => t.status === 'collected').length
    return { total, done, rate: total ? Math.round((done / total) * 100) : 0 }
  }, [state.tasks])

  const criticalTrend = useMemo(() => {
    const buckets: Array<{ label: string; events: number }> = []
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const events = state.activity.filter(
        (e) => e.kind === 'bin-threshold' && e.createdAt.slice(0, 10) === key,
      ).length
      buckets.push({ label: d.toLocaleDateString('en-IN', { weekday: 'short' }), events })
    }
    return buckets
  }, [state.activity])

  const pointsByStudent = useMemo(
    () =>
      [...state.students]
        .sort((a, b) => b.points - a.points)
        .map((s) => ({ name: s.name.split(' ')[0], points: s.points })),
    [state.students],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-ink-900">Waste Analytics</h2>
          <p className="text-sm text-ink-500">Charts reflect the same shared demo state as every dashboard.</p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge label="Demo dataset" />
          <Select
            aria-label="Date range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-40"
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Collection volume"
            subtitle={`Estimated waste logged per day (kg) — last ${days} days`}
          />
          <div className="mt-5 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volume} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e6e5" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a8783' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a8783' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e3e6e5',
                    fontSize: 12,
                  }}
                  formatter={(value: number, name) =>
                    name === 'kg' ? [`${value} kg`, 'Collected'] : [value, name]
                  }
                />
                <Area type="monotone" dataKey="kg" stroke="#059669" strokeWidth={2} fill="url(#vol)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Category split" subtitle="Submissions by waste type" />
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {distribution.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e3e6e5', fontSize: 12 }}
                  formatter={(value: number) => [`${value} submissions`, '']}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => <span style={{ fontSize: 12, color: '#4a5551' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Collection completion" subtitle="Assigned pickups completed" />
          <div className="mt-6 text-center">
            <p className="text-4xl font-semibold tabular-nums text-ink-900">{completion.rate}%</p>
            <p className="mt-1 text-sm text-ink-500">
              {completion.done} of {completion.total} tasks completed
            </p>
          </div>
          <div className="mt-5">
            <ProgressBar value={completion.rate} status={completion.rate >= 70 ? 'normal' : 'attention'} />
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Critical events" subtitle="Threshold crossings logged this week" />
          <div className="mt-5 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={criticalTrend} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e6e5" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a8783' }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a8783' }} />
                <Tooltip
                  cursor={{ fill: 'rgba(225,29,72,0.06)' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e3e6e5', fontSize: 12 }}
                />
                <Bar dataKey="events" fill="#e11d48" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="GreenPoints by student" subtitle="Total points earned across the demo" />
        <div className="mt-5 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pointsByStudent} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e6e5" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a8783' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7a8783' }} />
              <Tooltip
                cursor={{ fill: 'rgba(16,185,129,0.08)' }}
                contentStyle={{ borderRadius: 12, border: '1px solid #e3e6e5', fontSize: 12 }}
                formatter={(value: number) => [`${formatNumber(value)} pts`, 'Points']}
              />
              <Bar dataKey="points" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

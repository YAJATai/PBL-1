import { ArrowRight, Gauge, Leaf, Route, ShieldCheck, Sparkles, Truck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { DemoBadge } from '@/components/ui/DemoBadge'

const roles = [
  {
    to: '/student',
    icon: UserRound,
    title: 'Student',
    copy: 'Scan bin QR codes, log responsible disposal, earn GreenPoints and climb the leaderboard.',
    accent: 'bg-neon-teal text-ink-950',
  },
  {
    to: '/admin',
    icon: Gauge,
    title: 'Campus Admin',
    copy: 'Monitor bin fill levels, dispatch collection routes, and resolve overflow alerts in real time.',
    accent: 'bg-neon-green text-ink-950',
  },
  {
    to: '/driver',
    icon: Truck,
    title: 'Collection Driver',
    copy: 'Follow your assigned route, mark arrivals, complete pickups, and update campus operations.',
    accent: 'bg-neon-gold text-ink-950',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink-900">
      <div className="relative mx-auto max-w-6xl px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink-900 bg-neon-teal text-ink-950 shadow-brutal-sm">
              <Leaf className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-sm font-display uppercase tracking-tight">GreenPoints</span>
          </div>
        </header>

        <section className="mt-16 max-w-3xl sm:mt-24">
          <span className="inline-flex items-center gap-2 rounded-lg border-2 border-ink-900 bg-neon-green px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-950 shadow-brutal-sm">
            <Sparkles className="h-3.5 w-3.5" /> Gamified Smart Waste Management
          </span>
          <h1 className="mt-6 text-4xl font-display uppercase leading-[1.05] tracking-tight sm:text-6xl">
            Turn Waste <span className="border-b-4 border-ink-900 bg-neon-gold px-2">into Rewards.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-700">
            GreenPoints connects students, campus operations, and collection crews on one shared
            simulation. Scan, earn, monitor, and collect — the whole loop in a single demo.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/student"
              className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-ink-900 bg-neon-teal px-6 text-sm font-bold uppercase tracking-wide text-ink-950 shadow-card transition hover:-translate-y-0.5 hover:shadow-raised"
            >
              Enter the demo <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-sm font-medium text-ink-600">by Char Yaar Ek Kaam · MIT ADT University</span>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {roles.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="group rounded-xl border-2 border-ink-900 bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:shadow-raised"
            >
              <span className={cn('flex h-11 w-11 items-center justify-center rounded-lg border-2 border-ink-900 shadow-brutal-sm', r.accent)}>
                <r.icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-display uppercase tracking-tight">{r.title}</h2>
              <p className="mt-1.5 text-sm text-ink-600">{r.copy}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-ink-900">
                Open {r.title}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-14 flex flex-wrap items-center gap-6 text-sm font-semibold text-ink-700">
          <span className="inline-flex items-center gap-2">
            <Route className="h-4 w-4 text-[#006e73]" /> Shared demo state across all roles
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#007a3d]" /> Duplicate-safe point awarding
          </span>
          <span className="inline-flex items-center gap-2">
            <Gauge className="h-4 w-4 text-[#006e73]" /> Deterministic live simulation
          </span>
        </section>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t-2 border-ink-900/20 pt-6 text-xs font-medium text-ink-600">
          <span>Prototype only — IoT fill levels, vehicle GPS and routes are simulated.</span>
          <DemoBadge label="Demo environment" />
        </footer>
      </div>
    </div>
  )
}
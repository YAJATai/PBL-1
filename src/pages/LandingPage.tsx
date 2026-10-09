import { ArrowRight, Gauge, Leaf, Route, ShieldCheck, Sparkles, Truck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DemoBadge } from '@/components/ui/DemoBadge'

const roles = [
  {
    to: '/student',
    icon: UserRound,
    title: 'Student',
    copy: 'Scan bin QR codes, log responsible disposal, earn GreenPoints and climb the leaderboard.',
    accent: 'bg-brand-50 text-brand-700',
  },
  {
    to: '/admin',
    icon: Gauge,
    title: 'Campus Admin',
    copy: 'Monitor bin fill levels, dispatch collection routes, and resolve overflow alerts in real time.',
    accent: 'bg-blue-50 text-blue-700',
  },
  {
    to: '/driver',
    icon: Truck,
    title: 'Collection Driver',
    copy: 'Follow your assigned route, mark arrivals, complete pickups, and update campus operations.',
    accent: 'bg-amber-50 text-amber-700',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <div className="relative mx-auto max-w-6xl px-6 py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-ink-950">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold tracking-tight">GreenPoints</span>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
            HackADT 2026 · MIT ADT
          </span>
        </header>

        <section className="mt-16 max-w-3xl sm:mt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
            <Sparkles className="h-3.5 w-3.5" /> Gamified Smart Waste Management
          </span>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Turn Waste <span className="text-brand-400">into Rewards.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/60">
            GreenPoints connects students, campus operations, and collection crews on one shared
            simulation. Scan, earn, monitor, and collect — the whole loop in a single demo.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/student"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
            >
              Enter the demo <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-sm text-white/40">
              by Char Yaar Ek Kaam · MIT ADT University
            </span>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {roles.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-brand-500/40 hover:bg-white/[0.06]"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${r.accent}`}>
                <r.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">{r.title}</h2>
              <p className="mt-1.5 text-sm text-white/55">{r.copy}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300">
                Open {r.title}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-14 flex flex-wrap items-center gap-6 text-sm text-white/50">
          <span className="inline-flex items-center gap-2">
            <Route className="h-4 w-4 text-brand-400" /> Shared demo state across all roles
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-400" /> Duplicate-safe point awarding
          </span>
          <span className="inline-flex items-center gap-2">
            <Gauge className="h-4 w-4 text-brand-400" /> Deterministic live simulation
          </span>
        </section>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40">
          <span>Prototype only — IoT fill levels, vehicle GPS and routes are simulated.</span>
          <DemoBadge className="bg-white/10 text-white/60" label="Demo environment" />
        </footer>
      </div>
    </div>
  )
}

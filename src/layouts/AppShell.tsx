import {
  BarChart3,
  Bell,
  Gauge,
  Leaf,
  LogOut,
  Menu,
  QrCode,
  Recycle,
  Route,
  Store,
  Truck,
  Trophy,
  UserRound,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useApp } from '@/store/AppContext'
import { DemoBadge } from '@/components/ui/DemoBadge'
import { formatRelativeTime } from '@/lib/format'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const NAV: Record<'student' | 'admin' | 'driver', NavItem[]> = {
  student: [
    { to: '/student', label: 'Dashboard', icon: Gauge, end: true },
    { to: '/student/scan', label: 'Scan & Earn', icon: QrCode },
    { to: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/student/market', label: 'Market', icon: Store },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: Gauge, end: true },
    { to: '/admin/bins', label: 'Bin Monitoring', icon: Recycle },
    { to: '/admin/vehicles', label: 'Fleet', icon: Truck },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ],
  driver: [{ to: '/driver', label: 'My Route', icon: Route, end: true }],
}

function roleFromPath(path: string): 'student' | 'admin' | 'driver' {
  if (path.startsWith('/admin')) return 'admin'
  if (path.startsWith('/driver')) return 'driver'
  return 'student'
}

export function Brand({ compact = false, onDark = false }: { compact?: boolean; onDark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="GreenPoints home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink-900 bg-neon-teal text-ink-950 shadow-brutal-sm">
        <Leaf className="h-5 w-5" aria-hidden />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className={cn('block text-sm font-display uppercase tracking-tight', onDark ? 'text-white' : 'text-ink-900')}>
            GreenPoints
          </span>
          <span className={cn('block text-[11px] font-bold uppercase tracking-wider', onDark ? 'text-white/70' : 'text-ink-500')}>
            Campus Waste Ops
          </span>
        </span>
      )}
    </Link>
  )
}

function RoleSwitcher({ role }: { role: 'student' | 'admin' | 'driver' }) {
  const options: Array<{ key: 'student' | 'admin' | 'driver'; label: string; to: string; icon: LucideIcon }> = [
    { key: 'student', label: 'Student', to: '/student', icon: UserRound },
    { key: 'admin', label: 'Admin', to: '/admin', icon: Gauge },
    { key: 'driver', label: 'Driver', to: '/driver', icon: Truck },
  ]
  return (
    <div
      role="radiogroup"
      aria-label="Switch demo role"
      className="flex items-center gap-1 rounded-lg border-2 border-ink-900 bg-surface p-1 shadow-brutal-sm"
    >
      {options.map((o) => {
        const active = o.key === role
        return (
          <Link
            key={o.key}
            to={o.to}
            role="radio"
            aria-checked={active}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors',
              active ? 'bg-ink-900 text-white shadow-brutal-sm shadow-ink-900' : 'text-ink-600 hover:bg-paper',
            )}
          >
            <o.icon className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">{o.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

function NotificationBell({ onDark = false }: { onDark?: boolean }) {
  const { state } = useApp()
  const [open, setOpen] = useState(false)
  const openAlerts = state.alerts.filter((a) => a.status !== 'resolved')

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink-900',
          onDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-surface text-ink-700 hover:bg-paper',
        )}
        aria-label={`Notifications (${openAlerts.length} open)`}
        aria-expanded={open}
      >
        <Bell className="h-4 w-4" />
        {openAlerts.length > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink-900 bg-status-critical px-1 text-[11px] font-bold text-white">
            {openAlerts.length}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border-2 border-ink-900 bg-surface p-2 shadow-raised animate-scale-in">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-ink-900">Operational alerts</span>
              <span className="text-xs text-ink-500">{openAlerts.length} open</span>
            </div>
            <div className="max-h-72 overflow-y-auto scrollbar-thin">
              {openAlerts.length === 0 && (
                <p className="px-2 py-6 text-center text-sm text-ink-500">No open alerts.</p>
              )}
              {openAlerts.map((a) => (
                <Link
                  key={a.id}
                  to="/admin/bins"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2 hover:bg-paper"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full border border-ink-900',
                        a.severity === 'critical' ? 'bg-status-critical' : 'bg-status-attention',
                      )}
                    />
                    <span className="truncate text-sm font-medium text-ink-800">{a.title}</span>
                  </div>
                  <p className="mt-0.5 pl-4 text-xs text-ink-500">{formatRelativeTime(a.createdAt)}</p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function AppShell() {
  const location = useLocation()
  const { state, resetDemo } = useApp()
  const role = roleFromPath(location.pathname)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  const nav = NAV[role]
  const pageTitle = useMemo(() => {
    const match = [...nav]
      .sort((a, b) => b.to.length - a.to.length)
      .find((n) => location.pathname === n.to || location.pathname.startsWith(`${n.to}/`))
    return match?.label ?? 'Dashboard'
  }, [location.pathname, nav])

  const student = state.students.find((s) => s.id === state.currentStudentId)

  const sidebar: ReactNode = (
    <div className="flex h-full flex-col gap-6 bg-[#064e3b] p-4">
      <div className="flex items-center justify-between">
        <Brand onDark />
        <button
          type="button"
          className="rounded-lg border-2 border-white/30 p-1.5 text-white lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5" aria-label="Primary">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg border-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors',
                isActive
                  ? 'border-ink-900 bg-neon-teal text-ink-950 shadow-brutal-sm'
                  : 'border-transparent text-white/75 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <item.icon className="h-[18px] w-[18px]" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-xl border-2 border-white/25 bg-white/10 p-3 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-white/25 bg-white/15 text-white">
            {role === 'student' ? (
              <UserRound className="h-4 w-4" />
            ) : role === 'admin' ? (
              <Gauge className="h-4 w-4" />
            ) : (
              <Truck className="h-4 w-4" />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {role === 'student' ? student?.name : role === 'admin' ? 'Campus Operations' : 'Ravi Kumar'}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">{role} demo</p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetDemo}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-ink-900 bg-paper px-3 py-2 text-xs font-bold uppercase tracking-wide text-ink-900 shadow-brutal-sm transition hover:bg-neon-gold"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden />
          Reset demo data
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r-2 border-ink-900 lg:block">
        {sidebar}
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/50" onClick={() => setDrawerOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-72 border-r-2 border-ink-900 animate-slide-in-right">
            {sidebar}
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b-2 border-ink-900 bg-paper/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink-900 bg-surface text-ink-700 shadow-brutal-sm lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-display uppercase tracking-tight text-ink-900">{pageTitle}</h1>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-xs font-medium text-ink-600">Simulation Mode</span>
                <span className="h-1 w-1 rounded-full bg-ink-900" />
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-status-normal">
                  <span className="h-1.5 w-1.5 rounded-full border border-ink-900 bg-status-normal" />
                  Live demo state
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <RoleSwitcher role={role} />
            </div>
            <DemoBadge className="hidden xl:inline-flex" label="Demo env" />
            <NotificationBell />
          </div>
          <div className="border-t-2 border-ink-900 px-4 py-2 md:hidden">
            <RoleSwitcher role={role} />
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink-900 bg-neon-gold text-ink-950 shadow-brutal-sm">
        <Compass className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="text-2xl font-display uppercase tracking-tight text-ink-900">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-600">
        That route isn’t part of the GreenPoints demo. Head back to the role selector.
      </p>
      <Link
        to="/"
        className="inline-flex h-10 items-center rounded-xl border-2 border-ink-900 bg-ink-900 px-5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-raised"
      >
        Back to role selector
      </Link>
    </div>
  )
}
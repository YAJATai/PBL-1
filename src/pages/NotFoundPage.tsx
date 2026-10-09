import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-muted px-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Compass className="h-6 w-6" />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-500">
        That route isn’t part of the GreenPoints demo. Head back to the role selector.
      </p>
      <Link
        to="/"
        className="inline-flex h-10 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Back to role selector
      </Link>
    </div>
  )
}

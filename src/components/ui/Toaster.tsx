import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useApp } from '@/store/AppContext'
import { cn } from '@/lib/cn'

const icons = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
}

const tone = {
  success: 'text-brand-600',
  error: 'text-rose-600',
  info: 'text-blue-600',
}

export function Toaster() {
  const { toasts, dismissToast } = useApp()
  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => {
        const Icon = icons[t.variant]
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-ink-100 bg-surface p-3.5 shadow-raised animate-slide-in-right"
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', tone[t.variant])} aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-ink-500">{t.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="rounded-md p-1 text-ink-400 hover:bg-surface-muted hover:text-ink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink-400"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

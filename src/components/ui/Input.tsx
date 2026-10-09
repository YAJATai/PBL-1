import { Search } from 'lucide-react'
import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-lg border-2 border-ink-900 bg-surface px-3.5 text-sm text-ink-900',
          'placeholder:text-ink-400 focus:border-ink-900 focus:outline-none focus:shadow-brutal-sm focus:shadow-ink-900 focus:ring-0',
          'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:shadow-none',
          'transition-shadow duration-100',
          className,
        )}
        {...props}
      />
    )
  },
)

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  'aria-label': ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  'aria-label'?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="pl-9"
      />
    </div>
  )
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full appearance-none rounded-lg border-2 border-ink-900 bg-surface px-3.5 pr-9 text-sm font-medium text-ink-900',
        'bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%230d1117\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpath d=\'m6 9 6 6 6-6\'/%3e%3c/svg%3e")] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat',
        'focus:border-ink-900 focus:outline-none focus:shadow-brutal-sm focus:ring-0',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
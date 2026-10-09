import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-card focus-visible:outline-brand-600',
  secondary:
    'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-950 shadow-card focus-visible:outline-ink-900',
  outline:
    'border border-ink-200 bg-surface text-ink-800 hover:bg-surface-muted active:bg-surface-sunken focus-visible:outline-ink-400',
  ghost: 'text-ink-600 hover:bg-surface-muted active:bg-surface-sunken focus-visible:outline-ink-400',
  danger:
    'bg-status-critical text-white hover:brightness-95 active:brightness-90 focus-visible:outline-status-critical',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2 rounded-xl',
  icon: 'h-9 w-9 rounded-lg justify-center',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center font-medium transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
})

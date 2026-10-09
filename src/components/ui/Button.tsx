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
    'border-2 border-ink-900 bg-neon-teal text-ink-950 shadow-card hover:bg-[#00d4da] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  secondary:
    'border-2 border-ink-900 bg-ink-900 text-white shadow-card hover:bg-ink-800 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  outline:
    'border-2 border-ink-900 bg-surface text-ink-900 shadow-card hover:bg-paper active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  ghost: 'border-2 border-transparent text-ink-700 hover:bg-paper active:bg-paper-dark',
  danger:
    'border-2 border-ink-900 bg-status-critical text-white shadow-card hover:brightness-95 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[11px] gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-xs gap-2 rounded-xl',
  lg: 'h-12 px-6 text-sm gap-2 rounded-xl',
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
        'inline-flex select-none items-center justify-center font-bold uppercase tracking-wide',
        'transition-[transform,box-shadow,background-color] duration-100',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:translate-x-0 disabled:active:translate-y-0',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
})
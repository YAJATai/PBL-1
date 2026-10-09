import { BIN_THRESHOLDS, type BinStatus } from '@/types'

export function statusFromFill(fill: number): BinStatus {
  if (fill >= BIN_THRESHOLDS.critical) return 'critical'
  if (fill >= BIN_THRESHOLDS.attention) return 'attention'
  return 'normal'
}

export function statusLabel(status: BinStatus): string {
  switch (status) {
    case 'normal':
      return 'Normal'
    case 'attention':
      return 'Attention'
    case 'critical':
      return 'Critical'
    case 'collected':
      return 'Collected'
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(value))
}

export function formatKg(value: number): string {
  return `${value.toFixed(1)} kg`
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDemoDate(date = new Date()): string {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

let counter = 0
export function uid(prefix = 'id'): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter}-${Math.random().toString(36).slice(2, 7)}`
}

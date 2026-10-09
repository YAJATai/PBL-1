import type { WasteCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types'

export { CATEGORY_LABELS }

export const CATEGORY_TONE: Record<WasteCategory, 'success' | 'warning' | 'info'> = {
  recyclable: 'success',
  organic: 'warning',
  general: 'info',
}

export const CATEGORY_TONE_FALLBACK = 'neutral' as const

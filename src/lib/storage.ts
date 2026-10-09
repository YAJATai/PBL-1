import type { AppState } from '@/types'
import { createInitialState } from '@/data/seed'

export const STORAGE_KEY = 'greenpoints.demo.state.v1'

interface PersistedState {
  version: 1
  state: AppState
}

function isValidState(value: unknown): value is AppState {
  if (!value || typeof value !== 'object') return false
  const s = value as Partial<AppState>
  return (
    Array.isArray(s.bins) &&
    Array.isArray(s.students) &&
    Array.isArray(s.submissions) &&
    typeof s.currentStudentId === 'string'
  )
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed = JSON.parse(raw) as PersistedState | AppState
    const state = (parsed as PersistedState).state ?? (parsed as AppState)
    if (isValidState(state)) {
      return {
        ...createInitialState(),
        ...state,
        simulationRunning: false,
      }
    }
  } catch {
    // corrupted storage — fall through to a fresh seed
  }
  return createInitialState()
}

export function saveState(state: AppState): void {
  try {
    const payload: PersistedState = { version: 1, state }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // storage may be unavailable (private mode) — demo still works in-memory
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

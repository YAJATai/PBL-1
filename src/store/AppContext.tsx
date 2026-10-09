import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { AppState, Toast, WasteCategory } from '@/types'
import { createInitialState } from '@/data/seed'
import { clearState, loadState, saveState } from '@/lib/storage'
import { uid } from '@/lib/format'
import {
  acknowledgeAlert as svcAcknowledge,
  arrivePickup as svcArrive,
  completePickup as svcComplete,
  redeemReward as svcRedeem,
  resolveAlert as svcResolve,
  simulateStep as svcSimulate,
  startShift as svcStartShift,
  submitWaste as svcSubmit,
} from '@/services/operations'

type Action = { type: 'SET'; state: AppState } | { type: 'RESET'; state: AppState }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET':
      return action.state
    case 'RESET':
      return action.state
    default:
      return state
  }
}

export interface SubmitOutcome {
  ok: boolean
  duplicate: boolean
  points: number
  message: string
}

export interface RedeemOutcome {
  ok: boolean
  message: string
}

interface AppContextValue {
  state: AppState
  toasts: Toast[]
  pushToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
  submitWaste: (binId: string, category: WasteCategory, scanId: string) => SubmitOutcome
  redeemReward: (rewardId: string) => RedeemOutcome
  runSimulationStep: () => AppState
  resetDemo: () => void
  acknowledgeAlert: (alertId: string) => void
  resolveAlert: (alertId: string) => void
  startShift: (driverId: string) => void
  arrivePickup: (taskId: string) => void
  completePickup: (taskId: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [toasts, setToasts] = useState<Toast[]>([])
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    saveState(state)
  }, [state])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = uid('toast')
      setToasts((prev) => [...prev.slice(-3), { ...toast, id }])
      window.setTimeout(() => dismissToast(id), 4200)
    },
    [dismissToast],
  )

  const commit = useCallback((next: AppState) => {
    dispatch({ type: 'SET', state: next })
    stateRef.current = next
  }, [])

  const submitWaste = useCallback(
    (binId: string, category: WasteCategory, scanId: string): SubmitOutcome => {
      const result = svcSubmit(stateRef.current, {
        studentId: stateRef.current.currentStudentId,
        binId,
        category,
        scanId,
      })
      if (result.duplicate) {
        return {
          ok: false,
          duplicate: true,
          points: 0,
          message: 'This scan was already submitted — points are only awarded once.',
        }
      }
      if (result.points === 0) {
        return { ok: false, duplicate: false, points: 0, message: 'Could not record submission.' }
      }
      commit(result.state)
      return {
        ok: true,
        duplicate: false,
        points: result.points,
        message: `Submission verified. +${result.points} GreenPoints awarded.`,
      }
    },
    [commit],
  )

  const redeemReward = useCallback(
    (rewardId: string): RedeemOutcome => {
      const result = svcRedeem(stateRef.current, {
        studentId: stateRef.current.currentStudentId,
        rewardId,
      })
      if (result.error) return { ok: false, message: result.error }
      commit(result.state)
      return { ok: true, message: 'Reward redeemed. Points deducted exactly once.' }
    },
    [commit],
  )

  const runSimulationStep = useCallback((): AppState => {
    const next = svcSimulate(stateRef.current)
    commit(next)
    return next
  }, [commit])

  const resetDemo = useCallback(() => {
    clearState()
    const fresh = createInitialState()
    dispatch({ type: 'RESET', state: fresh })
    stateRef.current = fresh
  }, [])

  const acknowledgeAlert = useCallback(
    (alertId: string) => commit(svcAcknowledge(stateRef.current, alertId)),
    [commit],
  )

  const resolveAlert = useCallback(
    (alertId: string) => commit(svcResolve(stateRef.current, alertId)),
    [commit],
  )

  const startShift = useCallback(
    (driverId: string) => commit(svcStartShift(stateRef.current, driverId)),
    [commit],
  )

  const arrivePickup = useCallback(
    (taskId: string) => commit(svcArrive(stateRef.current, taskId)),
    [commit],
  )

  const completePickup = useCallback(
    (taskId: string) => commit(svcComplete(stateRef.current, taskId)),
    [commit],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      toasts,
      pushToast,
      dismissToast,
      submitWaste,
      redeemReward,
      runSimulationStep,
      resetDemo,
      acknowledgeAlert,
      resolveAlert,
      startShift,
      arrivePickup,
      completePickup,
    }),
    [
      state,
      toasts,
      pushToast,
      dismissToast,
      submitWaste,
      redeemReward,
      runSimulationStep,
      resetDemo,
      acknowledgeAlert,
      resolveAlert,
      startShift,
      arrivePickup,
      completePickup,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

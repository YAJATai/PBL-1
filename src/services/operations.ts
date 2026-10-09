import {
  POINTS_PER_CATEGORY,
  type ActivityEvent,
  type Alert,
  type AppState,
  type WasteCategory,
  type WasteSubmission,
} from '@/types'
import { statusFromFill, uid } from '@/lib/format'

const CO2_FACTOR: Record<WasteCategory, number> = {
  recyclable: 0.3,
  organic: 0.08,
  general: 0.05,
}

const FILL_ADD: Record<WasteCategory, number> = {
  recyclable: 4,
  organic: 5,
  general: 3,
}

const WEIGHT_BY_CATEGORY: Record<WasteCategory, number> = {
  recyclable: 0.7,
  organic: 1.1,
  general: 0.4,
}

function nowIso(): string {
  return new Date().toISOString()
}

function makeActivity(
  kind: ActivityEvent['kind'],
  message: string,
  actor: string,
): ActivityEvent {
  return { id: uid('evt'), kind, message, actor, createdAt: nowIso() }
}

export interface SubmitResult {
  state: AppState
  duplicate: boolean
  points: number
}

export function submitWaste(
  state: AppState,
  input: { studentId: string; binId: string; category: WasteCategory; scanId: string },
): SubmitResult {
  if (state.usedScanIds.includes(input.scanId)) {
    return { state, duplicate: true, points: 0 }
  }

  const student = state.students.find((s) => s.id === input.studentId)
  const bin = state.bins.find((b) => b.id === input.binId)
  if (!student || !bin) {
    return { state, duplicate: false, points: 0 }
  }

  const points = POINTS_PER_CATEGORY[input.category]
  const weightKg = WEIGHT_BY_CATEGORY[input.category]
  const co2SavedKg = Number((weightKg * CO2_FACTOR[input.category]).toFixed(2))

  const submission: WasteSubmission = {
    id: uid('sub'),
    studentId: student.id,
    binId: bin.id,
    binCode: bin.code,
    zone: bin.zone,
    category: input.category,
    points,
    weightKg,
    co2SavedKg,
    createdAt: nowIso(),
    verified: true,
  }

  const nextFill = Math.min(100, bin.fill + FILL_ADD[input.category])
  const nextStatus = nextFill >= bin.fill ? statusFromFill(nextFill) : bin.status

  const students = state.students.map((s) =>
    s.id === student.id
      ? { ...s, points: s.points + points, submissions: s.submissions + 1 }
      : s,
  )

  const bins = state.bins.map((b) =>
    b.id === bin.id ? { ...b, fill: nextFill, status: nextStatus, lastUpdated: nowIso() } : b,
  )

  let alerts = state.alerts
  const crossedCritical = bin.fill < 85 && nextFill >= 85
  if (crossedCritical) {
    alerts = ensureCriticalAlert(state.alerts, { ...bin, fill: nextFill })
  }

  const activity = [
    makeActivity(
      'submission',
      `${student.name} logged a ${input.category} submission at ${bin.zone} (+${points} pts).`,
      student.name,
    ),
    ...(crossedCritical
      ? [
          makeActivity(
            'bin-threshold',
            `${bin.code} (${bin.zone}) crossed 85% — critical alert created.`,
            'IoT Simulation',
          ),
        ]
      : []),
    ...state.activity,
  ].slice(0, 40)

  return {
    state: {
      ...state,
      students,
      bins,
      alerts,
      submissions: [submission, ...state.submissions],
      activity,
      usedScanIds: [...state.usedScanIds, input.scanId],
      lastScanId: input.scanId,
    },
    duplicate: false,
    points,
  }
}

function ensureCriticalAlert(alerts: Alert[], bin: { id: string; code: string; zone: string; fill: number }): Alert[] {
  const existing = alerts.find((a) => a.binId === bin.id && a.status !== 'resolved')
  if (existing) {
    return alerts.map((a) =>
      a.id === existing.id
        ? {
            ...a,
            severity: 'critical',
            status: 'open',
            title: `Critical fill level — ${bin.zone}`,
            message: `${bin.code} has reached ${Math.round(bin.fill)}% capacity and requires collection.`,
            createdAt: nowIso(),
            resolvedAt: null,
          }
        : a,
    )
  }
  const alert: Alert = {
    id: uid('alert'),
    severity: 'critical',
    status: 'open',
    binId: bin.id,
    title: `Critical fill level — ${bin.zone}`,
    message: `${bin.code} has reached ${Math.round(bin.fill)}% capacity and requires collection.`,
    createdAt: nowIso(),
    resolvedAt: null,
  }
  return [alert, ...alerts]
}

export interface RedeemResult {
  state: AppState
  error: string | null
}

export function redeemReward(
  state: AppState,
  input: { studentId: string; rewardId: string },
): RedeemResult {
  const student = state.students.find((s) => s.id === input.studentId)
  const reward = state.rewards.find((r) => r.id === input.rewardId)
  if (!student || !reward) return { state, error: 'Reward not found.' }
  if (student.points < reward.cost) return { state, error: 'Not enough GreenPoints.' }
  if (reward.stock <= 0) return { state, error: 'This reward is out of stock.' }

  const students = state.students.map((s) =>
    s.id === student.id ? { ...s, points: s.points - reward.cost } : s,
  )
  const rewards = state.rewards.map((r) =>
    r.id === reward.id ? { ...r, stock: r.stock - 1 } : r,
  )

  return {
    state: {
      ...state,
      students,
      rewards,
      redeemedRewardIds: [...state.redeemedRewardIds, reward.id],
      activity: [
        makeActivity('reward-redeemed', `${student.name} redeemed ${reward.title} (-${reward.cost} pts).`, student.name),
        ...state.activity,
      ].slice(0, 40),
    },
    error: null,
  }
}

export function acknowledgeAlert(state: AppState, alertId: string): AppState {
  return {
    ...state,
    alerts: state.alerts.map((a) =>
      a.id === alertId && a.status === 'open' ? { ...a, status: 'acknowledged' } : a,
    ),
  }
}

export function resolveAlert(state: AppState, alertId: string): AppState {
  const alert = state.alerts.find((a) => a.id === alertId)
  if (!alert || alert.status === 'resolved') return state
  return {
    ...state,
    alerts: state.alerts.map((a) =>
      a.id === alertId ? { ...a, status: 'resolved', resolvedAt: nowIso() } : a,
    ),
    activity: [
      makeActivity('alert-resolved', `Alert for ${alert.binId.toUpperCase()} marked resolved.`, 'Campus Ops'),
      ...state.activity,
    ].slice(0, 40),
  }
}

export function startShift(state: AppState, driverId: string): AppState {
  return {
    ...state,
    drivers: state.drivers.map((d) => (d.id === driverId ? { ...d, onShift: true } : d)),
    vehicles: state.vehicles.map((v) =>
      v.driverId === driverId && v.status === 'idle' ? { ...v, status: 'active' } : v,
    ),
  }
}

export function arrivePickup(state: AppState, taskId: string): AppState {
  const task = state.tasks.find((t) => t.id === taskId)
  if (!task) return state
  const bin = state.bins.find((b) => b.id === task.binId)
  const driver = state.drivers.find((d) => d.vehicleId === task.vehicleId)
  return {
    ...state,
    tasks: state.tasks.map((t) =>
      t.id === taskId ? { ...t, status: 'arrived' } : t,
    ),
    activity: [
      makeActivity(
        'driver-arrived',
        `${driver?.name ?? 'Driver'} arrived at ${bin?.zone ?? 'stop'}.`,
        driver?.name ?? 'Driver',
      ),
      ...state.activity,
    ].slice(0, 40),
  }
}

export function completePickup(state: AppState, taskId: string): AppState {
  const task = state.tasks.find((t) => t.id === taskId)
  if (!task || task.status === 'collected') return state
  const bin = state.bins.find((b) => b.id === task.binId)
  const vehicle = state.vehicles.find((v) => v.id === task.vehicleId)
  const driver = state.drivers.find((d) => d.vehicleId === task.vehicleId)

  const tasks = state.tasks.map((t) =>
    t.id === taskId ? { ...t, status: 'collected' as const, completedAt: nowIso() } : t,
  )

  const bins = state.bins.map((b) =>
    b.id === task.binId
      ? { ...b, fill: 0, status: 'collected' as const, lastUpdated: nowIso() }
      : b,
  )

  const vehicles = state.vehicles.map((v) =>
    v.id === task.vehicleId
      ? {
          ...v,
          completedToday: v.completedToday + 1,
          status: 'active' as const,
          capacityPct: Math.min(100, v.capacityPct + 8),
        }
      : v,
  )

  const resolvedAlerts = state.alerts.map((a) =>
    a.binId === task.binId && a.status !== 'resolved'
      ? { ...a, status: 'resolved' as const, resolvedAt: nowIso() }
      : a,
  )

  const extra: ActivityEvent[] = [
    makeActivity(
      'pickup-completed',
      `${bin?.code ?? 'Bin'} collected by ${driver?.name ?? vehicle?.name ?? 'vehicle'}.`,
      driver?.name ?? 'Driver',
    ),
  ]
  if (state.alerts.some((a) => a.binId === task.binId && a.status !== 'resolved')) {
    extra.push(
      makeActivity(
        'alert-resolved',
        `Alert for ${bin?.zone ?? 'bin'} resolved after collection.`,
        'System',
      ),
    )
  }

  return {
    ...state,
    tasks,
    bins,
    vehicles,
    alerts: resolvedAlerts,
    activity: [...extra, ...state.activity].slice(0, 40),
  }
}

const SIM_SEQUENCE: Array<{ binId: string; delta: number }> = [
  { binId: 'b5', delta: 9 },
  { binId: 'b8', delta: 13 },
  { binId: 'b10', delta: 21 },
  { binId: 'b4', delta: 15 },
  { binId: 'b9', delta: 40 },
  { binId: 'b2', delta: 18 },
  { binId: 'b12', delta: 26 },
  { binId: 'b10', delta: 12 },
  { binId: 'b4', delta: 20 },
  { binId: 'b9', delta: 30 },
]

export function simulateStep(state: AppState): AppState {
  const step = state.simulationStep
  const change = SIM_SEQUENCE[step % SIM_SEQUENCE.length]
  const target = state.bins.find((b) => b.id === change.binId)

  let alerts = state.alerts
  let crossed: { id: string; code: string; zone: string; fill: number } | null = null

  const bins = state.bins.map((b) => {
    if (b.id !== change.binId || !target) return b
    const nextFill = Math.min(100, b.fill + change.delta)
    const nextStatus = statusFromFill(nextFill)
    if (b.fill < 85 && nextFill >= 85) {
      crossed = { id: b.id, code: b.code, zone: b.zone, fill: nextFill }
    }
    return { ...b, fill: nextFill, status: nextStatus, lastUpdated: nowIso() }
  })

  const crossing = crossed as { id: string; code: string; zone: string; fill: number } | null
  if (crossing) {
    alerts = ensureCriticalAlert(alerts, crossing)
  }

  const events: ActivityEvent[] = []
  if (target) {
    events.push(
      makeActivity(
        'simulation',
        `Simulation tick ${step + 1}: ${target.code} (${target.zone}) updated to ${Math.min(100, target.fill + change.delta)}%.`,
        'IoT Simulation',
      ),
    )
    if (crossing) {
      events.push(
        makeActivity(
          'bin-threshold',
          `${crossing.code} (${crossing.zone}) crossed 85% — critical alert created.`,
          'IoT Simulation',
        ),
      )
    }
  }

  return {
    ...state,
    bins,
    alerts,
    simulationStep: step + 1,
    activity: [...events, ...state.activity].slice(0, 40),
  }
}

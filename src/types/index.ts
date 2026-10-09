export type Role = 'student' | 'admin' | 'driver'

export type WasteCategory = 'recyclable' | 'organic' | 'general'

export type BinStatus = 'normal' | 'attention' | 'critical' | 'collected'

export type StopStatus = 'pending' | 'enroute' | 'arrived' | 'collected' | 'skipped'

export type AlertSeverity = 'critical' | 'warning' | 'info'

export type AlertStatus = 'open' | 'acknowledged' | 'resolved'

export type ActivityKind =
  | 'submission'
  | 'bin-threshold'
  | 'route-assigned'
  | 'driver-arrived'
  | 'pickup-completed'
  | 'alert-resolved'
  | 'reward-redeemed'
  | 'simulation'

export interface Student {
  id: string
  name: string
  hostel: string
  points: number
  weeklyPoints: number
  submissions: number
  previousRank: number
}

export interface WasteBin {
  id: string
  code: string
  label: string
  zone: string
  category: WasteCategory
  fill: number
  status: BinStatus
  lastUpdated: string
  assignedVehicleId: string | null
  x: number
  y: number
}

export interface WasteSubmission {
  id: string
  studentId: string
  binId: string
  binCode: string
  zone: string
  category: WasteCategory
  points: number
  weightKg: number
  co2SavedKg: number
  createdAt: string
  verified: boolean
}

export interface Driver {
  id: string
  name: string
  vehicleId: string
  onShift: boolean
}

export interface CollectionVehicle {
  id: string
  code: string
  name: string
  driverId: string
  status: 'idle' | 'active' | 'returning'
  x: number
  y: number
  completedToday: number
  capacityPct: number
}

export interface PickupTask {
  id: string
  vehicleId: string
  binId: string
  sequence: number
  status: StopStatus
  priority: 'critical' | 'high' | 'normal'
  assignedAt: string
  completedAt: string | null
}

export interface Alert {
  id: string
  severity: AlertSeverity
  status: AlertStatus
  binId: string
  title: string
  message: string
  createdAt: string
  resolvedAt: string | null
}

export interface Reward {
  id: string
  title: string
  description: string
  cost: number
  category: 'food' | 'merch' | 'sustainability'
  stock: number
  demo: true
}

export interface ActivityEvent {
  id: string
  kind: ActivityKind
  message: string
  actor: string
  createdAt: string
}

export interface AppState {
  currentStudentId: string
  students: Student[]
  bins: WasteBin[]
  submissions: WasteSubmission[]
  vehicles: CollectionVehicle[]
  drivers: Driver[]
  tasks: PickupTask[]
  alerts: Alert[]
  rewards: Reward[]
  activity: ActivityEvent[]
  simulationStep: number
  simulationRunning: boolean
  lastScanId: string | null
  usedScanIds: string[]
  redeemedRewardIds: string[]
}

export interface Toast {
  id: string
  title: string
  description?: string
  variant: 'success' | 'error' | 'info'
}

export const BIN_THRESHOLDS = {
  attention: 70,
  critical: 85,
} as const

export const POINTS_PER_CATEGORY: Record<WasteCategory, number> = {
  recyclable: 25,
  organic: 15,
  general: 8,
}

export const CATEGORY_LABELS: Record<WasteCategory, string> = {
  recyclable: 'Recyclable',
  organic: 'Organic',
  general: 'General',
}

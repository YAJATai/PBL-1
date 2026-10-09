import type {
  ActivityEvent,
  Alert,
  AppState,
  CollectionVehicle,
  Driver,
  PickupTask,
  Reward,
  Student,
  WasteBin,
  WasteCategory,
  WasteSubmission,
} from '@/types'
import { POINTS_PER_CATEGORY } from '@/types'

const HOUR = 60 * 60 * 1000
const MIN = 60 * 1000

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString()
}

export const DEMO_LOCATIONS = [
  'Main Gate',
  'Central Library',
  'Canteen',
  'Sports Complex',
  'Hostel A',
  'Hostel B',
  'Academic Block',
  'Auditorium',
  'Visitor Parking',
  'Admin Building',
  'Innovation Lab',
  'Green Garden',
] as const

export function createInitialState(): AppState {
  const bins: WasteBin[] = [
    { id: 'b1', code: 'GP-CAMPUS-001', label: 'Main Gate Bin', zone: 'Main Gate', category: 'recyclable', fill: 42, status: 'normal', lastUpdated: ago(12 * MIN), assignedVehicleId: 'v1', x: 12, y: 78 },
    { id: 'b2', code: 'GP-CAMPUS-002', label: 'Library Recycling', zone: 'Central Library', category: 'recyclable', fill: 58, status: 'normal', lastUpdated: ago(28 * MIN), assignedVehicleId: 'v1', x: 34, y: 40 },
    { id: 'b3', code: 'GP-CAMPUS-003', label: 'Canteen Organic', zone: 'Canteen', category: 'organic', fill: 91, status: 'critical', lastUpdated: ago(6 * MIN), assignedVehicleId: 'v1', x: 52, y: 52 },
    { id: 'b4', code: 'GP-CAMPUS-004', label: 'Sports Complex Bin', zone: 'Sports Complex', category: 'general', fill: 64, status: 'normal', lastUpdated: ago(41 * MIN), assignedVehicleId: 'v2', x: 72, y: 74 },
    { id: 'b5', code: 'GP-CAMPUS-005', label: 'Hostel A Organic', zone: 'Hostel A', category: 'organic', fill: 77, status: 'attention', lastUpdated: ago(18 * MIN), assignedVehicleId: 'v2', x: 20, y: 26 },
    { id: 'b6', code: 'GP-CAMPUS-006', label: 'Hostel B Recycling', zone: 'Hostel B', category: 'recyclable', fill: 88, status: 'critical', lastUpdated: ago(9 * MIN), assignedVehicleId: 'v2', x: 30, y: 16 },
    { id: 'b7', code: 'GP-CAMPUS-007', label: 'Academic Block General', zone: 'Academic Block', category: 'general', fill: 35, status: 'normal', lastUpdated: ago(55 * MIN), assignedVehicleId: 'v3', x: 58, y: 24 },
    { id: 'b8', code: 'GP-CAMPUS-008', label: 'Auditorium Recycling', zone: 'Auditorium', category: 'recyclable', fill: 71, status: 'attention', lastUpdated: ago(23 * MIN), assignedVehicleId: 'v3', x: 82, y: 34 },
    { id: 'b9', code: 'GP-CAMPUS-009', label: 'Visitor Parking General', zone: 'Visitor Parking', category: 'general', fill: 22, status: 'normal', lastUpdated: ago(64 * MIN), assignedVehicleId: null, x: 10, y: 54 },
    { id: 'b10', code: 'GP-CAMPUS-010', label: 'Admin Building Recycling', zone: 'Admin Building', category: 'recyclable', fill: 49, status: 'normal', lastUpdated: ago(33 * MIN), assignedVehicleId: null, x: 46, y: 66 },
    { id: 'b11', code: 'GP-CAMPUS-011', label: 'Innovation Lab Organic', zone: 'Innovation Lab', category: 'organic', fill: 12, status: 'collected', lastUpdated: ago(2 * HOUR), assignedVehicleId: null, x: 68, y: 14 },
    { id: 'b12', code: 'GP-CAMPUS-012', label: 'Green Garden Organic', zone: 'Green Garden', category: 'organic', fill: 38, status: 'normal', lastUpdated: ago(47 * MIN), assignedVehicleId: 'v3', x: 88, y: 58 },
  ]

  const drivers: Driver[] = [
    { id: 'd1', name: 'Ravi Kumar', vehicleId: 'v1', onShift: true },
    { id: 'd2', name: 'Suresh Patil', vehicleId: 'v2', onShift: true },
    { id: 'd3', name: 'Meena Joshi', vehicleId: 'v3', onShift: false },
  ]

  const vehicles: CollectionVehicle[] = [
    { id: 'v1', code: 'GP-V01', name: 'Eco Hauler 01', driverId: 'd1', status: 'active', x: 30, y: 60, completedToday: 4, capacityPct: 55 },
    { id: 'v2', code: 'GP-V02', name: 'Eco Hauler 02', driverId: 'd2', status: 'active', x: 46, y: 30, completedToday: 2, capacityPct: 38 },
    { id: 'v3', code: 'GP-V03', name: 'Eco Hauler 03', driverId: 'd3', status: 'idle', x: 76, y: 48, completedToday: 1, capacityPct: 20 },
  ]

  const tasks: PickupTask[] = [
    { id: 't1', vehicleId: 'v1', binId: 'b3', sequence: 1, status: 'pending', priority: 'critical', assignedAt: ago(20 * MIN), completedAt: null },
    { id: 't2', vehicleId: 'v1', binId: 'b1', sequence: 2, status: 'pending', priority: 'normal', assignedAt: ago(40 * MIN), completedAt: null },
    { id: 't3', vehicleId: 'v1', binId: 'b2', sequence: 3, status: 'pending', priority: 'normal', assignedAt: ago(40 * MIN), completedAt: null },
    { id: 't4', vehicleId: 'v2', binId: 'b6', sequence: 1, status: 'pending', priority: 'critical', assignedAt: ago(15 * MIN), completedAt: null },
    { id: 't5', vehicleId: 'v2', binId: 'b5', sequence: 2, status: 'pending', priority: 'high', assignedAt: ago(35 * MIN), completedAt: null },
    { id: 't6', vehicleId: 'v2', binId: 'b4', sequence: 3, status: 'pending', priority: 'normal', assignedAt: ago(35 * MIN), completedAt: null },
    { id: 't7', vehicleId: 'v3', binId: 'b8', sequence: 1, status: 'pending', priority: 'high', assignedAt: ago(50 * MIN), completedAt: null },
    { id: 't8', vehicleId: 'v3', binId: 'b7', sequence: 2, status: 'pending', priority: 'normal', assignedAt: ago(50 * MIN), completedAt: null },
    { id: 't9', vehicleId: 'v3', binId: 'b12', sequence: 3, status: 'pending', priority: 'normal', assignedAt: ago(50 * MIN), completedAt: null },
  ]

  const alerts: Alert[] = [
    {
      id: 'a1',
      severity: 'critical',
      status: 'open',
      binId: 'b3',
      title: 'Critical fill level — Canteen Organic',
      message: 'GP-CAMPUS-003 has reached 91% capacity and requires collection.',
      createdAt: ago(6 * MIN),
      resolvedAt: null,
    },
    {
      id: 'a2',
      severity: 'critical',
      status: 'acknowledged',
      binId: 'b6',
      title: 'Critical fill level — Hostel B Recycling',
      message: 'GP-CAMPUS-006 has reached 88% capacity. Pickup task assigned to Eco Hauler 02.',
      createdAt: ago(9 * MIN),
      resolvedAt: null,
    },
    {
      id: 'a3',
      severity: 'warning',
      status: 'open',
      binId: 'b8',
      title: 'Approaching capacity — Auditorium Recycling',
      message: 'GP-CAMPUS-008 is at 71%. Schedule before it becomes critical.',
      createdAt: ago(23 * MIN),
      resolvedAt: null,
    },
  ]

  const students: Student[] = [
    { id: 's1', name: 'Aarav Sharma', hostel: 'Hostel A', points: 1450, weeklyPoints: 118, submissions: 42, previousRank: 2 },
    { id: 's2', name: 'Priya Nair', hostel: 'Hostel B', points: 1620, weeklyPoints: 145, submissions: 48, previousRank: 1 },
    { id: 's3', name: 'Rohan Mehta', hostel: 'Hostel A', points: 1180, weeklyPoints: 96, submissions: 33, previousRank: 4 },
    { id: 's4', name: 'Diya Kapoor', hostel: 'Hostel B', points: 1320, weeklyPoints: 132, submissions: 39, previousRank: 3 },
    { id: 's5', name: 'Ishaan Verma', hostel: 'Hostel A', points: 980, weeklyPoints: 74, submissions: 28, previousRank: 5 },
    { id: 's6', name: 'Ananya Rao', hostel: 'Hostel B', points: 870, weeklyPoints: 88, submissions: 25, previousRank: 7 },
    { id: 's7', name: 'Kabir Singh', hostel: 'Hostel A', points: 760, weeklyPoints: 60, submissions: 21, previousRank: 6 },
    { id: 's8', name: 'Sara Fernandes', hostel: 'Hostel B', points: 640, weeklyPoints: 52, submissions: 18, previousRank: 8 },
  ]

  const submissions: WasteSubmission[] = [
    { id: 'sub1', studentId: 's1', binId: 'b1', binCode: 'GP-CAMPUS-001', zone: 'Main Gate', category: 'recyclable', points: 25, weightKg: 0.8, co2SavedKg: 0.24, createdAt: ago(2 * HOUR), verified: true },
    { id: 'sub2', studentId: 's1', binId: 'b2', binCode: 'GP-CAMPUS-002', zone: 'Central Library', category: 'recyclable', points: 25, weightKg: 0.6, co2SavedKg: 0.18, createdAt: ago(26 * HOUR), verified: true },
    { id: 'sub3', studentId: 's1', binId: 'b10', binCode: 'GP-CAMPUS-010', zone: 'Admin Building', category: 'general', points: 8, weightKg: 0.4, co2SavedKg: 0.05, createdAt: ago(30 * HOUR), verified: true },
    { id: 'sub4', studentId: 's1', binId: 'b5', binCode: 'GP-CAMPUS-005', zone: 'Hostel A', category: 'organic', points: 15, weightKg: 1.2, co2SavedKg: 0.1, createdAt: ago(50 * HOUR), verified: true },
  ]

  // Deterministic history for the weekly activity chart (last 7 days, incl. today).
  const weeklyPattern: Array<{ daysAgo: number; count: number; category: WasteCategory }> = [
    { daysAgo: 6, count: 2, category: 'recyclable' },
    { daysAgo: 5, count: 1, category: 'organic' },
    { daysAgo: 4, count: 3, category: 'recyclable' },
    { daysAgo: 3, count: 2, category: 'general' },
    { daysAgo: 2, count: 4, category: 'recyclable' },
    { daysAgo: 1, count: 2, category: 'organic' },
    { daysAgo: 0, count: 1, category: 'recyclable' },
  ]
  let extraIndex = 0
  for (const day of weeklyPattern) {
    for (let i = 0; i < day.count; i += 1) {
      const ts = ago((day.daysAgo * 24 + (i + 1) * 2) * HOUR)
      extraIndex += 1
      submissions.push({
        id: `subH${extraIndex}`,
        studentId: 's1',
        binId: 'b1',
        binCode: 'GP-CAMPUS-001',
        zone: 'Main Gate',
        category: day.category,
        points: POINTS_PER_CATEGORY[day.category],
        weightKg: 0.5,
        co2SavedKg: Number((0.5 * (day.category === 'recyclable' ? 0.3 : day.category === 'organic' ? 0.08 : 0.05)).toFixed(2)),
        createdAt: ts,
        verified: true,
      })
    }
  }

  const rewards: Reward[] = [
    { id: 'r1', title: 'Campus Café Voucher', description: '₹100 off at the campus café. Demo reward.', cost: 500, category: 'food', stock: 24, demo: true },
    { id: 'r2', title: 'Reusable Steel Bottle', description: 'Branded 750ml insulated bottle. Demo reward.', cost: 800, category: 'sustainability', stock: 12, demo: true },
    { id: 'r3', title: 'GreenPoints T-Shirt', description: 'Organic cotton merchandise. Demo reward.', cost: 1200, category: 'merch', stock: 8, demo: true },
    { id: 'r4', title: 'Tree Plantation Kit', description: 'Plant a sapling in your name. Demo reward.', cost: 350, category: 'sustainability', stock: 40, demo: true },
  ]

  const activity: ActivityEvent[] = [
    { id: 'e1', kind: 'bin-threshold', message: 'GP-CAMPUS-003 (Canteen) crossed 85% — critical alert created.', actor: 'IoT Simulation', createdAt: ago(6 * MIN) },
    { id: 'e2', kind: 'submission', message: 'Aarav Sharma logged a recyclable submission at Main Gate (+25 pts).', actor: 'Aarav Sharma', createdAt: ago(2 * HOUR) },
    { id: 'e3', kind: 'route-assigned', message: 'Pickup route assigned to Eco Hauler 01 (3 stops).', actor: 'Dispatch', createdAt: ago(20 * MIN) },
    { id: 'e4', kind: 'driver-arrived', message: 'Ravi Kumar arrived at Hostel B Recycling.', actor: 'Ravi Kumar', createdAt: ago(2 * HOUR + 20 * MIN) },
    { id: 'e5', kind: 'pickup-completed', message: 'GP-CAMPUS-011 collected by Eco Hauler 03.', actor: 'Meena Joshi', createdAt: ago(2 * HOUR) },
    { id: 'e6', kind: 'alert-resolved', message: 'Alert for GP-CAMPUS-011 resolved after collection.', actor: 'System', createdAt: ago(2 * HOUR - 5 * MIN) },
  ]

  return {
    currentStudentId: 's1',
    students,
    bins,
    submissions,
    vehicles,
    drivers,
    tasks,
    alerts,
    rewards,
    activity,
    simulationStep: 0,
    simulationRunning: false,
    lastScanId: null,
    usedScanIds: [],
    redeemedRewardIds: [],
  }
}

import type { Student } from '@/types'

export type RankMetric = 'points' | 'weeklyPoints'

export interface RankedStudent extends Student {
  rank: number
  movement: number
}

export function rankStudents(students: Student[], metric: RankMetric = 'points'): RankedStudent[] {
  return [...students]
    .sort((a, b) => b[metric] - a[metric] || a.name.localeCompare(b.name))
    .map((s, index) => ({
      ...s,
      rank: index + 1,
      movement: s.previousRank - (index + 1),
    }))
}

export function getRankFor(students: Student[], studentId: string): number {
  return rankStudents(students).find((s) => s.id === studentId)?.rank ?? 0
}

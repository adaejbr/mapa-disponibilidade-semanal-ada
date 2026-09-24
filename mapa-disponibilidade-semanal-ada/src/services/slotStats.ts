/** Pure statistics functions for availability slots - ported from home.html */

import type { UserSlots, SlotTotals, BestSlot } from '../types'
import { slotLabel } from '../utils/slots'

/** Count how many people have marked each slot */
export function computeTotals(users: UserSlots): SlotTotals {
  const totals: SlotTotals = {}
  for (const set of Object.values(users)) {
    if (set.size === 0) continue
    for (const key of set) {
      totals[key] = (totals[key] || 0) + 1
    }
  }
  return totals
}

/** Count how many users have at least one slot marked */
export function countPeople(users: UserSlots): number {
  return Object.values(users).filter((set) => set.size > 0).length
}

/** Get the best (most popular) slots, sorted by count desc then key asc */
export function computeBestSlots(
  totals: SlotTotals,
  limit = 5
): BestSlot[] {
  const entries = Object.entries(totals)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)

  return entries.map(([key, count]) => ({
    key,
    label: slotLabel(key),
    count,
  }))
}

/** Get the maximum count across all slots (for legend scaling) */
export function getMaxCount(totals: SlotTotals): number {
  return Math.max(0, ...Object.values(totals))
}
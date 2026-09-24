/** Domain types for the weekly availability app */

export type SlotKey = string // format: "dayIndex-hour" e.g. "0-9"

export interface UserSlots {
  [userName: string]: Set<SlotKey>
}

export interface SlotTotals {
  [slotKey: string]: number
}

export interface BestSlot {
  key: SlotKey
  label: string
  count: number
}

export interface AppState {
  users: UserSlots
  currentUser: string | null
  modalOpen: boolean
}
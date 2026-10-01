/** Domain types for the weekly availability app */

export type SlotKey = string // format: "dayIndex-hour" e.g. "0-9"

export type Sector = 'Jurídico-Financeiro' | 'Comercial' | 'Recursos Humanos' | 'Projetos' | 'Marketing' | 'Presidência'

export interface UserData {
  sector: Sector
  slots: Set<SlotKey>
}

export interface UserSlots {
  [userName: string]: UserData
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
  currentSector: Sector | null
  modalOpen: boolean
}
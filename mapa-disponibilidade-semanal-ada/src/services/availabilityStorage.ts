/** Storage service for availability data - ported from home.html */

import { STORAGE_KEY, USER_KEY } from '../constants'
import type { UserSlots } from '../types'

/** Load users data from localStorage */
export function loadUsers(): UserSlots {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    const users: UserSlots = {}
    for (const [name, arr] of Object.entries(parsed.users || {})) {
      users[name] = new Set(Array.isArray(arr) ? arr : [])
    }
    return users
  } catch (e) {
    console.warn('Não foi possível carregar os dados salvos.', e)
    return {}
  }
}

/** Save users data to localStorage */
export function saveUsers(users: UserSlots): void {
  const serializable: Record<string, string[]> = {}
  for (const [name, set] of Object.entries(users)) {
    serializable[name] = [...set]
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ users: serializable }))
  } catch (e) {
    console.warn('Não foi possível salvar.', e)
  }
}

/** Get the saved current user name */
export function getSavedUser(): string | null {
  try {
    return localStorage.getItem(USER_KEY)
  } catch {
    return null
  }
}

/** Save the current user name */
export function setSavedUser(name: string): void {
  try {
    localStorage.setItem(USER_KEY, name)
  } catch {
    // ignore
  }
}

/** Clear the saved user */
export function clearSavedUser(): void {
  try {
    localStorage.removeItem(USER_KEY)
  } catch {
    // ignore
  }
}
/** Storage service for availability data - using localForage for async storage */

import { STORAGE_KEY, USER_KEY } from '../constants'
import type { UserSlots } from '../types'
import storage from './localForageConfig'

/** Load users data from IndexedDB */
export async function loadUsers(): Promise<UserSlots> {
  try {
    const raw = await storage.getItem(STORAGE_KEY)
    if (!raw) return {}
    
    // LocalForage can store objects directly, but if it was stored as string we parse it
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    
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

/** Save users data to IndexedDB */
export async function saveUsers(users: UserSlots): Promise<void> {
  const serializable: Record<string, string[]> = {}
  for (const [name, set] of Object.entries(users)) {
    serializable[name] = [...set]
  }
  try {
    await storage.setItem(STORAGE_KEY, { users: serializable })
  } catch (e) {
    console.warn('Não foi possível salvar.', e)
  }
}

/** Get the saved current user name */
export async function getSavedUser(): Promise<string | null> {
  try {
    return await storage.getItem(USER_KEY)
  } catch {
    return null
  }
}

/** Save the current user name */
export async function setSavedUser(name: string): Promise<void> {
  try {
    await storage.setItem(USER_KEY, name)
  } catch {
    // ignore
  }
}

/** Clear the saved user */
export async function clearSavedUser(): Promise<void> {
  try {
    await storage.removeItem(USER_KEY)
  } catch {
    // ignore
  }
}
/** Storage service for availability data - using localForage for async storage */

import { STORAGE_KEY, USER_KEY } from '../constants'
import type { UserSlots } from '../types'
import storage from './localForageConfig'

/** Load users data from IndexedDB */
export async function loadUsers(): Promise<UserSlots> {
  try {
    const raw = await storage.getItem(STORAGE_KEY)
    if (!raw) return {}
    
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    
    const users: UserSlots = {}
    for (const [name, data] of Object.entries(parsed.users || {})) {
      // Check if data is in the new format { sector, slots } or old format [slots]
      if (data && typeof data === 'object' && 'sector' in data) {
        users[name] = {
          sector: data.sector,
          slots: new Set(Array.isArray(data.slots) ? data.slots : [])
        }
      } else {
        // Migration: fallback for old data format [slotKey, ...]
        users[name] = {
          sector: 'Projetos', // Default sector for old users
          slots: new Set(Array.isArray(data) ? data : [])
        }
      }
    }
    return users
  } catch (e) {
    console.warn('Não foi possível carregar os dados salvos.', e)
    return {}
  }
}

/** Save users data to IndexedDB */
export async function saveUsers(users: UserSlots): Promise<void> {
  const serializable: Record<string, { sector: string, slots: string[] }> = {}
  for (const [name, userData] of Object.entries(users)) {
    serializable[name] = {
      sector: userData.sector,
      slots: [...userData.slots]
    }
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
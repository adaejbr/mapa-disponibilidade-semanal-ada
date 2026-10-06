/** Storage service for availability data - using Firebase Firestore for global storage */

import { STORAGE_KEY, USER_KEY } from '../constants'
import { type Sector } from '../constants'
import type { UserSlots } from '../types'
import { db } from './firebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore'

/** Load users data from Firestore */
export async function loadUsers(): Promise<UserSlots> {
  try {
    const docRef = doc(db, 'availability', STORAGE_KEY);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return {};
    
    const parsed = docSnap.data();
    const usersData = parsed?.users || {};
    
    const users: UserSlots = {};
    for (const [name, data] of Object.entries(usersData)) {
      if (data && typeof data === 'object' && 'sector' in data) {
        const userData = data as { sector: Sector; slots: any[] };
        users[name] = {
          sector: userData.sector,
          slots: new Set(Array.isArray(userData.slots) ? userData.slots : [])
        };
      } else {
        users[name] = {
          sector: 'Projetos',
          slots: new Set(Array.isArray(data) ? data : [])
        };
      }
    }
    return users;
  } catch (e) {
    console.warn('Não foi possível carregar os dados do Firebase.', e);
    return {};
  }
}

/** Save users data to Firestore */
export async function saveUsers(users: UserSlots): Promise<void> {
  const serializable: Record<string, { sector: string, slots: string[] }> = {};
  for (const [name, userData] of Object.entries(users)) {
    serializable[name] = {
      sector: userData.sector,
      slots: [...userData.slots]
    };
  }
  try {
    await setDoc(doc(db, 'availability', STORAGE_KEY), { users: serializable });
  } catch (e) {
    console.warn('Não foi possível salvar no Firebase.', e);
  }
}

/** Get the saved current user name - Keeping this in localStorage for user preference */
export async function getSavedUser(): Promise<string | null> {
  return localStorage.getItem(USER_KEY);
}

/** Save the current user name - Keeping this in localStorage for user preference */
export async function setSavedUser(name: string): Promise<void> {
  localStorage.setItem(USER_KEY, name);
}

/** Clear the saved user - Keeping this in localStorage for user preference */
export async function clearSavedUser(): Promise<void> {
  localStorage.removeItem(USER_KEY);
}

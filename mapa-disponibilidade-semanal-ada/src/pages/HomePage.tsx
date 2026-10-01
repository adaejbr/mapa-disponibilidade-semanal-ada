import { useState, useEffect, useMemo, useCallback } from 'react'
import { loadUsers, saveUsers, getSavedUser, setSavedUser } from '../services/availabilityStorage'
import { computeTotals, countPeople, computeBestSlots } from '../services/slotStats'
import { heatColor } from '../utils/slots'
import { Header } from '../layout/Header'
import { Legend, StatsBar, BestSlots, ClearMineButton, UserModal, TimeGrid } from '../components'
import { SECTORS, type Sector } from '../constants'
import type { UserSlots } from '../types'
import styles from './HomePage.module.css'

export function HomePage() {
  // State
  const [users, setUsers] = useState<UserSlots>({})
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [currentSector, setCurrentSector] = useState<Sector | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    async function init() {
      try {
        const loadedUsers = await loadUsers()
        setUsers(loadedUsers)

        const savedUser = await getSavedUser()
        if (savedUser) {
          setCurrentUser(savedUser)
          const userData = loadedUsers[savedUser]
          if (userData) {
            setCurrentSector(userData.sector)
          } else {
            setUsers((prev) => ({ 
              ...prev, 
              [savedUser]: { sector: SECTORS[0], slots: new Set() } 
            }))
            setCurrentSector(SECTORS[0])
          }
        } else {
          setModalOpen(true)
        }
      } catch (e) {
        console.error('Erro ao inicializar dados:', e)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  // Save users whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveUsers(users)
    }
  }, [users, isLoading])

  const sectorUsers = useMemo(() => {
    if (!currentSector) return {}
    return Object.entries(users).reduce((acc, [name, data]) => {
      if (data.sector === currentSector) {
        acc[name] = data
      }
      return acc
    }, {} as UserSlots)
  }, [users, currentSector])

  const totals = useMemo(() => computeTotals(sectorUsers), [sectorUsers])
  const people = useMemo(() => countPeople(sectorUsers), [sectorUsers])
  const slotsCount = useMemo(() => Object.keys(totals).length, [totals])
  const bestSlots = useMemo(() => computeBestSlots(totals), [totals])
  const mine = useMemo(() => (currentUser && users[currentUser] ? users[currentUser].slots : new Set<string>()), [users, currentUser])
  const legendMax = people === 0 ? 'todos' : `${people} ${people === 1 ? 'pessoa' : 'pessoas'}`
  
  const existingUsers = useMemo(
    () => Object.entries(users).map(([name, data]) => ({ name, sector: data.sector })),
    [users]
  )

  // Handlers
  const handleLogin = useCallback(
    async (name: string, sector: Sector) => {
      const trimmed = name.trim()
      if (!trimmed) return

      setUsers((prev) => {
        if (!prev[trimmed]) {
          return { ...prev, [trimmed]: { sector, slots: new Set() } }
        }
        return prev
      })
      setCurrentUser(trimmed)
      setCurrentSector(sector)
      await setSavedUser(trimmed)
      setModalOpen(false)
    },
    []
  )

  const handleOpenModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const handleCellChange = useCallback(
    (key: string, add: boolean) => {
      if (!currentUser) {
        setModalOpen(true)
        return
      }

      // Only allow changes if the current user belongs to the sector being viewed
      const userData = users[currentUser]
      if (!userData || (currentSector && userData.sector !== currentSector)) {
        return
      }

      setUsers((prev) => {
        const currentData = prev[currentUser]
        if (!currentData) return prev

        const userSet = new Set(currentData.slots)
        if (add) {
          userSet.add(key)
        } else {
          userSet.delete(key)
        }
        return { ...prev, [currentUser]: { ...currentData, slots: userSet } }
      })
    },
    [currentUser, users, currentSector]
  )

  const handleClearMine = useCallback(() => {
    if (!currentUser) {
      setModalOpen(true)
      return
    }
    const userData = users[currentUser]
    if (!userData || userData.slots.size === 0) return

    setUsers((prev) => ({
      ...prev,
      [currentUser]: { ...userData, slots: new Set() },
    }))
  }, [currentUser, users])

  // Card wrapper content
  const toolbar = (
    <div className={styles.toolbar}>
      <div className={styles.sectorControl}>
        <label htmlFor="sectorSelect">Setor:</label>
        <select 
          id="sectorSelect" 
          value={currentSector || ''} 
          onChange={(e) => setCurrentSector(e.target.value as Sector)}
        >
          <option value="" disabled>Selecione um setor</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <Legend legendMax={legendMax} />
      <div className={styles.actions}>
        <ClearMineButton
          currentUser={currentUser}
          hasSelections={!!(currentUser && users[currentUser]?.slots.size > 0)}
          onClear={handleClearMine}
        />
      </div>
    </div>
  )

  const stats = (
    <div className={styles.stats}>
      <StatsBar people={people} slots={slotsCount} />
      <BestSlots bestSlots={bestSlots} />
    </div>
  )

  return (
    <div className={styles.wrap}>
      {isLoading ? (
        <div className={styles.loading}>Carregando disponibilidades...</div>
      ) : (
        <>
          <Header
            currentUser={currentUser}
            onLogin={handleOpenModal}
            onSwitchUser={handleOpenModal}
          />

          <section className={styles.card}>
            {toolbar}
            <TimeGrid
              totals={totals}
              people={people}
              mine={mine}
              onCellChange={handleCellChange}
              heatColor={heatColor}
            />
          </section>

          <section className={`${styles.card} ${styles.statsSection}`}>{stats}</section>

          <UserModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onLogin={handleLogin}
            existingUsers={existingUsers}
          />
        </>
      )}
    </div>
  )
}
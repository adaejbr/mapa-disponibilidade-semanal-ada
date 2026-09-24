/** HomePage component - main page for the availability app */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { DAYS, START_HOUR, END_HOUR } from '../constants'
import { loadUsers, saveUsers, getSavedUser, setSavedUser } from '../services/availabilityStorage'
import { computeTotals, countPeople, computeBestSlots } from '../services/slotStats'
import { heatColor } from '../utils/slots'
import { Header } from '../layout/Header'
import { Legend, StatsBar, BestSlots, ClearMineButton, UserModal, TimeGrid } from '../components'
import styles from './HomePage.module.css'

export function HomePage() {
  // State
  const [users, setUsers] = useState<Record<string, Set<string>>>({})
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Load initial data
  useEffect(() => {
    const loadedUsers = loadUsers()
    setUsers(loadedUsers)

    const savedUser = getSavedUser()
    if (savedUser) {
      setCurrentUser(savedUser)
      if (!loadedUsers[savedUser]) {
        setUsers((prev) => ({ ...prev, [savedUser]: new Set() }))
      }
    } else {
      setModalOpen(true)
    }
  }, [])

  // Save users whenever they change
  useEffect(() => {
    saveUsers(users)
  }, [users])

  // Derived state
  const totals = useMemo(() => computeTotals(users), [users])
  const people = useMemo(() => countPeople(users), [users])
  const slotsCount = useMemo(() => Object.keys(totals).length, [totals])
  const bestSlots = useMemo(() => computeBestSlots(totals), [totals])
  const mine = useMemo(() => (currentUser ? users[currentUser] || new Set() : new Set()), [users, currentUser])
  const legendMax = people === 0 ? 'todos' : `${people} ${people === 1 ? 'pessoa' : 'pessoas'}`
  const existingUsers = useMemo(
    () => Object.keys(users).filter((n) => (users[n]?.size ?? 0) > 0),
    [users]
  )

  // Handlers
  const handleLogin = useCallback(
    (name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return

      setUsers((prev) => {
        if (!prev[trimmed]) {
          return { ...prev, [trimmed]: new Set() }
        }
        return prev
      })
      setCurrentUser(trimmed)
      setSavedUser(trimmed)
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

      setUsers((prev) => {
        const userSet = new Set(prev[currentUser] || [])
        if (add) {
          userSet.add(key)
        } else {
          userSet.delete(key)
        }
        return { ...prev, [currentUser]: userSet }
      })
    },
    [currentUser]
  )

  const handleClearMine = useCallback(() => {
    if (!currentUser) {
      setModalOpen(true)
      return
    }
    if ((users[currentUser]?.size ?? 0) === 0) return
    if (!window.confirm('Limpar todas as suas seleções?')) return

    setUsers((prev) => ({
      ...prev,
      [currentUser]: new Set(),
    }))
  }, [currentUser, users])

  // Card wrapper content
  const toolbar = (
    <div className={styles.toolbar}>
      <Legend legendMax={legendMax} />
      <div className={styles.actions}>
        <ClearMineButton
          currentUser={currentUser}
          hasSelections={(users[currentUser]?.size ?? 0) > 0}
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

  const hint = (
    <p className={styles.hint}>
      💡 Dica: clique e arraste para marcar vários horários de uma vez. Clicar num horário já marcado desmarca.
    </p>
  )

  return (
    <div className={styles.wrap}>
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
        {hint}
      </section>

      <section className={`${styles.card} ${styles.statsSection}`}>{stats}</section>

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLogin={handleLogin}
        existingUsers={existingUsers}
      />
    </div>
  )
}
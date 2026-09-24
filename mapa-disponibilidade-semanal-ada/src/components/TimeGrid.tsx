/** TimeGrid component - interactive calendar grid with drag selection */

import { useRef, useEffect, useCallback } from 'react'
import { DAYS, START_HOUR, END_HOUR } from '../constants'
import { TimeCell } from './TimeCell'
import styles from './TimeGrid.module.css'

export interface TimeGridProps {
  totals: Record<string, number>
  people: number
  mine: Set<string>
  onCellChange: (key: string, add: boolean) => void
  heatColor: (ratio: number) => string
}

export function TimeGrid({
  totals,
  people,
  mine,
  onCellChange,
  heatColor,
}: TimeGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const dragModeRef = useRef(true) // true = adding, false = removing
  const visitedRef = useRef<Set<string>>(new Set())

  const denom = Math.max(1, people)

  // Cleanup pointer capture on unmount
  useEffect(() => {
    return () => {
      if (draggingRef.current && gridRef.current) {
        try {
          // Note: we can't easily release pointer capture here without the event
        } catch {
          // ignore
        }
      }
    }
  }, [])

  const applyCell = useCallback(
    (key: string) => {
      if (visitedRef.current.has(key)) return
      visitedRef.current.add(key)
      onCellChange(key, dragModeRef.current)
    },
    [onCellChange]
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, key: string) => {
      const target = e.currentTarget
      if (!target) return

      e.preventDefault()
      try {
        target.setPointerCapture(e.pointerId)
      } catch {
        // ignore
      }

      draggingRef.current = true
      visitedRef.current.clear()

      const isMarked = mine.has(key)
      dragModeRef.current = !isMarked // if already marked, drag removes
      applyCell(key)
    },
    [applyCell, mine]
  )

  const handlePointerMove = useCallback(
    (_e: React.PointerEvent<HTMLDivElement>, key: string) => {
      if (!draggingRef.current) return
      applyCell(key)
    },
    [applyCell]
  )

  const handlePointerUp = useCallback(() => {
    if (!draggingRef.current) return
    draggingRef.current = false
    visitedRef.current.clear()
  }, [])

  const handlePointerCancel = useCallback(() => {
    if (!draggingRef.current) return
    draggingRef.current = false
    visitedRef.current.clear()
  }, [])

  // Generate grid cells
  const cells = []
  for (let h = START_HOUR; h < END_HOUR; h++) {
    // Time label
    cells.push(
      <div key={`time-${h}`} className={styles.time}>
        {String(h).padStart(2, '0')}:00
      </div>
    )

    // 7 days
    for (let d = 0; d < 7; d++) {
      const key = `${d}-${h}`
      const count = totals[key] || 0
      const ratio = count / denom
      const isMine = mine.has(key)

      cells.push(
        <TimeCell
          key={key}
          slotKey={key}
          count={count}
          ratio={ratio}
          isMine={isMine}
          heatColor={heatColor}
          onPointerDown={(e) => handlePointerDown(e, key)}
          onPointerMove={(e) => handlePointerMove(e, key)}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        />
      )
    }
  }

  return (
    <div className={styles.gridScroll}>
      <div ref={gridRef} className={styles.calendar} role="grid">
        {/* Top-left corner */}
        <div className={styles.corner} />

        {/* Day headers */}
        {DAYS.map((day: string) => (
          <div key={day} className={styles.dayHead}>
            {day}
          </div>
        ))}

        {/* Grid cells */}
        {cells}
      </div>
    </div>
  )
}
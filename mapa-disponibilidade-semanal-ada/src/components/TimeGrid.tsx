/* eslint-disable no-unused-vars */
/** TimeGrid component - interactive calendar grid with drag selection */

import React, { useState } from 'react'
import { useRef, useEffect, useCallback, useMemo } from 'react'
import { DAYS, START_HOUR, END_HOUR } from '../constants'
import { TimeCell } from './TimeCell'
import { Tooltip } from './Tooltip'
import styles from './TimeGrid.module.css'

export interface TimeGridProps {
  totals: Record<string, number>
  people: number
  mine: Set<string>
  sectorUsers: Record<string, { sector: string; slots: Set<string> }>
  onCellChange: (_key: string, _add: boolean) => void
  heatColor: (_ratio: number) => string
}

export function TimeGrid({
  totals,
  people,
  mine,
  sectorUsers,
  onCellChange,
  heatColor,
}: TimeGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const dragModeRef = useRef(true) // true = adding, false = removing
  const visitedRef = useRef<Set<string>>(new Set())
  const [tooltipState, setTooltipState] = useState<{ users: string[]; slotKey: string; x: number; y: number } | null>(null)

  const denom = Math.max(1, people)

  // Memoize users per slot for tooltip
  const usersPerSlot = useMemo(() => {
    const map: Record<string, string[]> = {}
    Object.entries(sectorUsers).forEach(([userName, data]) => {
      data.slots.forEach((slotKey) => {
        if (!map[slotKey]) map[slotKey] = []
        map[slotKey].push(userName)
      })
    })
    return map
  }, [sectorUsers])

  // Cleanup pointer capture on unmount
  useEffect(() => {
    const grid = gridRef.current
    return () => {
      if (draggingRef.current && grid) {
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

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>, key: string) => {
    const users = usersPerSlot[key] || []
    if (users.length === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipState({
      users,
      slotKey: key,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    })
  }, [usersPerSlot])

  const handleMouseLeave = useCallback(() => {
    setTooltipState(null)
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, key: string) => {
      const target = e.currentTarget
      if (!target) return

      if (e.pointerType === 'touch') {
        const isMarked = mine.has(key)
          onCellChange(key, !isMarked)
          return
        }

        try {
          target.setPointerCapture(e.pointerId)
        } catch {
          // ignore
        }

        draggingRef.current = true
        visitedRef.current.clear()

        const isMarked = mine.has(key)
        dragModeRef.current = !isMarked
        applyCell(key)
      },
      [applyCell, mine, onCellChange]
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
            onMouseEnter={(e) => handleMouseEnter(e, key)}
            onMouseLeave={handleMouseLeave}
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

          {/* Tooltip */}
          {tooltipState && (
            <Tooltip
              users={tooltipState.users}
              slotKey={tooltipState.slotKey}
              x={tooltipState.x}
              y={tooltipState.y}
            />
          )}
        </div>
      </div>
    )
  }
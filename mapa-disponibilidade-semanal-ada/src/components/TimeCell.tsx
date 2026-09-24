/** TimeCell component - presentational cell for the availability grid */

import { memo } from 'react'
import styles from './TimeCell.module.css'

export interface TimeCellProps {
  slotKey: string
  count: number
  ratio: number
  isMine: boolean
  heatColor: (ratio: number) => string
  onPointerDown: (_e: React.PointerEvent<HTMLDivElement>) => void
  onPointerMove: (_e: React.PointerEvent<HTMLDivElement>) => void
  onPointerUp: () => void
  onPointerCancel: () => void
}

const TimeCellComponent = memo(function TimeCell({
  slotKey,
  count,
  ratio,
  isMine,
  heatColor,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: TimeCellProps) {
  if (count === 0) {
    return (
      <div
        className={`${styles.cell} ${isMine ? styles.mine : ''}`}
        data-key={slotKey}
        role="gridcell"
        tabIndex={0}
        style={{ background: 'var(--empty)', color: 'var(--text)', borderColor: 'var(--line)' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <span className={styles.num} />
      </div>
    )
  }

  const bgColor = heatColor(ratio)
  const textColor = ratio > 0.7 ? '#ffffff' : '#14532d'

  return (
    <div
      className={`${styles.cell} ${isMine ? styles.mine : ''}`}
      data-key={slotKey}
      role="gridcell"
      tabIndex={0}
      style={{
        background: bgColor,
        color: textColor,
        borderColor: 'var(--line)',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <span className={styles.num}>{count}</span>
    </div>
  )
})

TimeCellComponent.displayName = 'TimeCell'

export const TimeCell = TimeCellComponent
import { memo } from 'react'
import styles from './Tooltip.module.css'

export interface TooltipProps {
  users: string[]
  slotKey: string
  x: number
  y: number
}

const TooltipComponent = memo(function Tooltip({ users, slotKey, x, y }: TooltipProps) {
  if (users.length === 0) return null

  const [dayStr, hourStr] = slotKey.split('-')
  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const dayName = dayNames[parseInt(dayStr)] || dayStr
  const hour = parseInt(hourStr)

  return (
    <div
      className={styles.tooltip}
      style={{
        left: x,
        top: y,
      }}
      role="tooltip"
    >
      <div className={styles.header}>
        {dayName} {String(hour).padStart(2, '0')}:00
      </div>
      <ul className={styles.list}>
        {users.map((user) => (
          <li key={user} className={styles.item}>{user}</li>
        ))}
      </ul>
      <div className={styles.footer}>
        {users.length} {users.length === 1 ? 'pessoa' : 'pessoas'}
      </div>
    </div>
  )
})

TooltipComponent.displayName = 'Tooltip'

export const Tooltip = TooltipComponent
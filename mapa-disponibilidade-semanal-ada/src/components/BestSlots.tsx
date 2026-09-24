/** BestSlots component - shows top 5 best time slots */

import type { BestSlot } from '../types/index'

export interface BestSlotsProps {
  bestSlots: BestSlot[]
}

export function BestSlots({ bestSlots }: BestSlotsProps) {
  return (
    <div className="best">
      <h3>Melhores horários</h3>
      <ul>
        {bestSlots.length === 0 ? (
          <li className="muted">Nenhum horário marcado ainda.</li>
        ) : (
          bestSlots.map((slot) => (
            <li key={slot.key}>
              <span>{slot.label}</span>
              <span className="pill">
                 - {slot.count} {slot.count === 1 ? 'pessoa' : 'pessoas'}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
/** StatsBar component - shows participant count and slot count */

export interface StatsBarProps {
  people: number
  slots: number
}

export function StatsBar({ people, slots }: StatsBarProps) {
  return (
    <div className="statRow">
      <div className="stat">
        <span>{people}</span>
        <small> participantes</small>
      </div>
      <div className="stat">
        <span>{slots}</span>
        <small> horários marcados</small>
      </div>
    </div>
  )
}
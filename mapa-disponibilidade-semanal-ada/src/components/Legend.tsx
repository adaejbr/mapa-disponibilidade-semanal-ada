/** Legend component - heat map legend bar */

export interface LegendProps {
  legendMax: string // "todos" or "N pessoas"
}

export function Legend({ legendMax }: LegendProps) {
  return (
    <div className="legend">
      <span>0</span>
      <div className="legendBar" />
      <span id="legendMax">{legendMax}</span>
    </div>
  )
}
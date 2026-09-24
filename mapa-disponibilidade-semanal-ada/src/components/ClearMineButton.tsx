/** ClearMineButton component - button to clear current user's selections */

export interface ClearMineButtonProps {
  currentUser: string | null
  hasSelections: boolean
  onClear: () => void
}

export function ClearMineButton({ currentUser, hasSelections, onClear }: ClearMineButtonProps) {
  if (!currentUser || !hasSelections) return null

  return (
    <button className="btn danger" type="button" onClick={onClear}>
      Limpar minhas seleções
    </button>
  )
}
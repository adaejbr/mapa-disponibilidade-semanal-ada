/** ClearMineButton component - button to clear current user's selections */
import styles from './ClearMineButton.module.css'
export interface ClearMineButtonProps {
  currentUser: string | null
  hasSelections: boolean
  onClear: () => void
}

export function ClearMineButton({ currentUser, hasSelections, onClear }: ClearMineButtonProps) {
  if (!currentUser || !hasSelections) return null

  return (
    <button className={styles.btn + ' ' + styles.danger} type="button" onClick={onClear}>
      Limpar minhas seleções
    </button>
  )
}
/** Header component - user bar with login/switch */

import { useMemo } from 'react'
import styles from './Header.module.css'

interface HeaderProps {
  currentUser: string | null
  onLogin: () => void
  onSwitchUser: () => void
}

export function Header({ currentUser, onLogin, onSwitchUser }: HeaderProps) {
  const content = useMemo(() => {
    if (currentUser) {
      return (
        <span className={styles.userBar}>
          Você é <strong>{currentUser}</strong>
          <button className={styles.link} type="button" onClick={onSwitchUser}>
            trocar
          </button>
        </span>
      )
    }
    return (
      <button className={styles.link} type="button" onClick={onLogin}>
        Entrar com seu nome
      </button>
    )
  }, [currentUser, onLogin, onSwitchUser])

  return (
    <header className={styles.top}>
      <div>
        <h1>Disponibilidade Semanal</h1>
        <p className={styles.sub}>
          Clique e arraste para marcar os horários em que você pode. Quanto mais verde, mais gente disponível.
        </p>
      </div>
      <div className={styles.userBarContainer}>{content}</div>
    </header>
  )
}
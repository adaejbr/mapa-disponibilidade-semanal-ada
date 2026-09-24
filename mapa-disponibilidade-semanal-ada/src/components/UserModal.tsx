/** UserModal component - modal for user identification */

import { useEffect, useRef, useState } from 'react'
import styles from './UserModal.module.css'

export interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (name: string) => void
  existingUsers: string[]
}

export function UserModal({ isOpen, onClose: _onClose, onLogin, existingUsers }: UserModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    if (isOpen) {
      setName('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) {
      onLogin(trimmed)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modalCard}>
        <h2 id="modal-title">Quem é você?</h2>
        <p>Digite seu nome para marcar sua disponibilidade na semana.</p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            id="nameInput"
            type="text"
            maxLength={24}
            placeholder="Seu nome"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.btn} type="submit">
            Começar
          </button>
        </form>

        {existingUsers.length > 0 && (
          <div className={styles.existingUsers}>
            <p className={styles.mutedSmall}>Ou continue como:</p>
            <div className={styles.chips}>
              {existingUsers.map((user) => (
                <button
                  key={user}
                  className={styles.chip}
                  type="button"
                  onClick={() => onLogin(user)}
                >
                  {user}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
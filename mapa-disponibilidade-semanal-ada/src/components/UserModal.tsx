/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/** UserModal component - modal for user identification */

import { useEffect, useRef, useState } from 'react'
import styles from './UserModal.module.css'
import { SECTORS, type Sector } from '../constants'

export interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (name: string, sector: Sector) => void
  existingUsers: { name: string; sector: Sector }[]
}

export function UserModal({ isOpen, onLogin }: UserModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [sector, setSector] = useState<Sector>(SECTORS[0])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) {
      onLogin(trimmed, sector)
      setName('')
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
        <p>Selecione seu setor e digite seu nome para marcar sua disponibilidade.</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="sectorSelect">Setor</label>
            <select
              id="sectorSelect"
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector)}
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="nameInput">Nome</label>
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
          </div>
          <button className={styles.btn} type="submit">
            Começar
          </button>
        </form>

        {/* {existingUsers.length > 0 && (
          <div className={styles.existingUsers}>
            <p className={styles.mutedSmall}>Ou continue como:</p>
            <div className={styles.chips}>
              {existingUsers.map((user) => (
                <button
                  key={user.name}
                  className={styles.chip}
                  type="button"
                  onClick={() => onLogin(user.name, user.sector)}
                >
                  {user.name} <span className={styles.sectorTag}>({user.sector})</span>
                </button>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}
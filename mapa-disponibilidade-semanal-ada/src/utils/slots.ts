/** Slot utilities ported from home.html */

import { DAYS, HEAT_CONFIG } from '../constants'

/** Build a slot key from day index and hour */
export function slotKey(dayIndex: number, hour: number): string {
  return `${dayIndex}-${hour}`
}

/** Parse a slot key into day index and hour */
export function parseSlotKey(key: string): { dayIndex: number; hour: number } | null {
  const parts = key.split('-').map(Number)
  if (parts.length !== 2 || parts.some(Number.isNaN)) return null
  return { dayIndex: parts[0], hour: parts[1] }
}

/** Human-readable label for a slot key */
export function slotLabel(key: string): string {
  const parsed = parseSlotKey(key)
  if (!parsed) return key
  const { dayIndex, hour } = parsed
  const day = DAYS[dayIndex] ?? '???'
  return `${day} ${String(hour).padStart(2, '0')}:00`
}

/** Heat color interpolation: 0 → almost white, 1 → vivid green (matches home.html) */
export function heatColor(ratio: number): string {
  const { hue, lightness, saturation } = HEAT_CONFIG
  const l = lightness.min - (lightness.min - lightness.max) * ratio // 93% → 37%
  const s = saturation.min + (saturation.max - saturation.min) * ratio // 40% → 82%
  return `hsl(${hue} ${s.toFixed(1)}% ${l.toFixed(1)}%)`
}

/** Generate all slot keys for the grid */
export function generateAllSlotKeys(): string[] {
  const keys: string[] = []
  for (let d = 0; d < DAYS.length; d++) {
    for (let h = 7; h < 22; h++) {
      keys.push(slotKey(d, h))
    }
  }
  return keys
}
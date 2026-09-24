/** Application constants ported from home.html */

export const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const

export const START_HOUR = 7
export const END_HOUR = 22 // exclusive

export const STORAGE_KEY = 'agenda-disponibilidade-v1'
export const USER_KEY = 'agenda-disponibilidade-user'

// Heat map configuration (matches home.html heatColor function)
export const HEAT_CONFIG = {
  hue: 142,
  lightness: { min: 93, max: 37 }, // 93% -> 37%
  saturation: { min: 40, max: 82 }, // 40% -> 82%
} as const

export const GRID_CONFIG = {
  timeLabelWidth: 58,
  minCellWidth: 0,
  gap: 4,
  minGridWidth: 660,
} as const
/**
 * Sprite sheet coordinate mapping for animations
 * Sprite sheet is 10 rows x 8 columns
 * Assuming each cell is approximately 128x128 pixels
 */

export interface SpriteCoordinate {
  row: number;
  col: number;
  frames: number;
}

export const SPRITE_MAP = {
  // Baby Goblin (Level 1)
  BABY_IDLE: {
    row: 0,
    col: 0,
    frames: 3,
  },
  BABY_EAT: {
    row: 1,
    col: 0,
    frames: 3,
  },
  BABY_SICK: {
    row: 2,
    col: 0,
    frames: 2,
  },

  // Teen Goblin (Level 2)
  TEEN_IDLE: {
    row: 4,
    col: 3,
    frames: 4,
  },
  TEEN_LAUGH: {
    row: 5,
    col: 3,
    frames: 3,
  },
  TEEN_SICK: {
    row: 3,
    col: 3,
    frames: 2,
  },

  // Monster Goblin (Level 3)
  MONSTER_IDLE: {
    row: 7,
    col: 4,
    frames: 2,
  },
  MONSTER_GLITCH: {
    row: 6,
    col: 4,
    frames: 4,
  },
  MONSTER_ATTACK: {
    row: 8,
    col: 4,
    frames: 4,
  },
} as const;

export const SPRITE_CELL_SIZE = 128; // pixels
export const SPRITE_SHEET_COLS = 8;
export const SPRITE_SHEET_ROWS = 10;


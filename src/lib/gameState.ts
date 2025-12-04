/**
 * Core game state types and interfaces for Tab Goblin
 */

export type GoblinLevel = 1 | 2 | 3;
export type GoblinMood = 'HAPPY' | 'GREEDY' | 'CORRUPT' | 'DEAD';

export interface PetState {
  name: string;
  level: GoblinLevel;
  xp: number; // 0-100, triggers evolution
  health: number; // 0-100
  mood: GoblinMood;
}

export interface EnvironmentState {
  tabCount: number;
  waterCleanliness: number; // 0-100
  isNight: boolean;
}

export interface GameStats {
  tabsClosed: number;
  totalXP: number;
  lastActiveTime: number;
  firstPlayTime: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  focusModeActive: boolean;
  isFirstRun: boolean;
}

export interface GameState {
  pet: PetState;
  environment: EnvironmentState;
  stats: GameStats;
  settings: GameSettings;
}

export const DEFAULT_GAME_STATE: GameState = {
  pet: {
    name: 'Gob',
    level: 1,
    xp: 0,
    health: 100,
    mood: 'HAPPY',
  },
  environment: {
    tabCount: 0,
    waterCleanliness: 100,
    isNight: false,
  },
  stats: {
    tabsClosed: 0,
    totalXP: 0,
    lastActiveTime: Date.now(),
    firstPlayTime: Date.now(),
  },
  settings: {
    soundEnabled: false,
    focusModeActive: false,
    isFirstRun: true,
  },
};


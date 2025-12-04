/**
 * Centralized game configuration
 * All balance values and magic numbers live here
 */

export const GAME_CONFIG = {
  // Tab thresholds
  tabs: {
    safeMax: 10,
    warningMax: 25,
    dangerMax: 50,
  },

  // XP and leveling
  xp: {
    basePerTab: 5,
    level2Threshold: 100,
    level3Threshold: 250,
    maxLevel: 3,
  },

  // Diminishing returns for XP farming prevention
  diminishingReturns: {
    startAfterTabs: 10,
    multiplier: 0.1,
    resetPeriodMinutes: 60,
  },

  // Health mechanics
  health: {
    max: 100,
    boostPerTabClosed: 2,
    corruptionDamagePerMinute: 1,
    neglectDamagePerCheck: 20,
    neglectThresholdHours: 24,
  },

  // Environment / Mood
  environment: {
    cleanWater: 100,
    warningWater: 70,
    dangerWater: 40,
    criticalWater: 10,
    nightStartHour: 22,
    nightEndHour: 6,
  },

  // Animation
  animation: {
    normalFps: 8,
    corruptedFps: 15,
    eatingDurationMs: 600,
  },

  // Alarms
  alarms: {
    healthCheckIntervalMinutes: 1,
  },
} as const;

export type GameConfig = typeof GAME_CONFIG;


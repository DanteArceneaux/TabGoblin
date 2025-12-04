/**
 * Game constants and thresholds
 */

export const THRESHOLDS = {
  // Tab count thresholds
  SAFE_MAX: 10,
  WARNING_MAX: 25,
  DANGER_MAX: 50,

  // XP thresholds for evolution
  LEVEL_2_XP: 100,
  LEVEL_3_XP: 250,

  // Time-based constants
  DEATH_TIMER_MINUTES: 30,
  NEGLECT_TIME_HOURS: 24,
  ALARM_INTERVAL_MINUTES: 1,

  // XP rewards
  BASE_XP_PER_TAB: 5,
  DIMINISHING_RETURNS_START: 10,
  DIMINISHING_RETURNS_RATE: 0.1,
} as const;

export const STORAGE_KEYS = {
  GAME_STATE: 'tabgoblin_state',
  SETTINGS: 'tabgoblin_settings',
} as const;

export const ALARMS = {
  HEALTH_CHECK: 'tabgoblin_health_check',
} as const;

export const MESSAGES = {
  TAB_CLOSED: 'TAB_CLOSED',
  TAB_OPENED: 'TAB_OPENED',
  UPDATE_STATE: 'UPDATE_STATE',
  GET_STATE: 'GET_STATE',
} as const;


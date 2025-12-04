/**
 * Background Service Worker for Tab Goblin
 * Handles tab monitoring, state management, and periodic health checks
 */

import { GameState, DEFAULT_GAME_STATE, GoblinMood } from './lib/gameState';
import { THRESHOLDS, STORAGE_KEYS, ALARMS, MESSAGES } from './lib/constants';

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Initialize default state
    await chrome.storage.local.set({ [STORAGE_KEYS.GAME_STATE]: DEFAULT_GAME_STATE });
  }

  // Set up periodic health check alarm
  chrome.alarms.create(ALARMS.HEALTH_CHECK, {
    periodInMinutes: THRESHOLDS.ALARM_INTERVAL_MINUTES,
  });
});

// Open side panel when user clicks the extension icon
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Tab event listeners
chrome.tabs.onCreated.addListener(async () => {
  await updateTabCount();
});

chrome.tabs.onRemoved.addListener(async () => {
  await handleTabClosed();
  await updateTabCount();
});

chrome.tabs.onUpdated.addListener(async () => {
  await updateTabCount();
});

// Periodic health check via alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARMS.HEALTH_CHECK) {
    await performHealthCheck();
  }
});

// Message handler for UI communication
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === MESSAGES.GET_STATE) {
    chrome.storage.local.get(STORAGE_KEYS.GAME_STATE).then((result) => {
      sendResponse(result[STORAGE_KEYS.GAME_STATE]);
    });
    return true; // Keep channel open for async response
  }
});

/**
 * Update tab count and calculate environment state
 */
async function updateTabCount() {
  const tabs = await chrome.tabs.query({});
  const tabCount = tabs.length;

  const state = await getGameState();
  
  // Calculate mood based on tab count
  let mood: GoblinMood = 'HAPPY';
  let waterCleanliness = 100;
  
  if (tabCount > THRESHOLDS.DANGER_MAX) {
    mood = 'CORRUPT';
    waterCleanliness = 10;
  } else if (tabCount > THRESHOLDS.WARNING_MAX) {
    mood = 'GREEDY';
    waterCleanliness = 40;
  } else if (tabCount > THRESHOLDS.SAFE_MAX) {
    mood = 'GREEDY';
    waterCleanliness = 70;
  }

  state.environment.tabCount = tabCount;
  state.environment.waterCleanliness = waterCleanliness;
  state.pet.mood = mood;

  await saveGameState(state);
}

/**
 * Handle tab closure (feeding mechanic)
 */
async function handleTabClosed() {
  const state = await getGameState();

  // Calculate XP with diminishing returns
  const recentTabs = state.stats.tabsClosed % 60; // Per-hour tracking
  let xpGain: number = THRESHOLDS.BASE_XP_PER_TAB;

  if (recentTabs > THRESHOLDS.DIMINISHING_RETURNS_START) {
    xpGain = Math.floor(xpGain * THRESHOLDS.DIMINISHING_RETURNS_RATE);
  }

  if (xpGain > 0) {
    state.pet.xp += xpGain;
    state.stats.totalXP += xpGain;
    state.stats.tabsClosed += 1;

    // Check for level up
    if (state.pet.level === 1 && state.pet.xp >= THRESHOLDS.LEVEL_2_XP) {
      state.pet.level = 2;
      state.pet.xp = 0;
    } else if (state.pet.level === 2 && state.pet.xp >= THRESHOLDS.LEVEL_3_XP) {
      state.pet.level = 3;
      state.pet.xp = 0;
    }

    // Health boost from closing tabs
    state.pet.health = Math.min(100, state.pet.health + 2);
  }

  state.stats.lastActiveTime = Date.now();
  await saveGameState(state);

  // Notify UI of feed event
  chrome.runtime.sendMessage({ type: MESSAGES.TAB_CLOSED });
}

/**
 * Periodic health check (decay from inactivity or high tab count)
 */
async function performHealthCheck() {
  const state = await getGameState();
  const now = Date.now();
  const timeSinceActive = now - state.stats.lastActiveTime;
  const hoursSinceActive = timeSinceActive / (1000 * 60 * 60);

  // Neglect penalty
  if (hoursSinceActive > THRESHOLDS.NEGLECT_TIME_HOURS) {
    state.pet.health = Math.max(0, state.pet.health - 20);
  }

  // Corruption penalty (high tab count)
  if (state.environment.tabCount > THRESHOLDS.DANGER_MAX) {
    state.pet.health = Math.max(0, state.pet.health - 1);
  }

  // Check for death
  if (state.pet.health <= 0) {
    state.pet.mood = 'DEAD';
  }

  // Update night mode
  const currentHour = new Date().getHours();
  state.environment.isNight = currentHour >= 22 || currentHour < 6;

  await saveGameState(state);
}

/**
 * Get current game state from storage
 */
async function getGameState(): Promise<GameState> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.GAME_STATE);
  return result[STORAGE_KEYS.GAME_STATE] || DEFAULT_GAME_STATE;
}

/**
 * Save game state to storage
 */
async function saveGameState(state: GameState): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.GAME_STATE]: state });
}


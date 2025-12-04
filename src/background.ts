/**
 * Background Service Worker for Tab Goblin
 * Simplified - delegates all game logic to GameEngine
 */

import { gameEngine } from './lib/GameEngine';
import { storageService } from './lib/StorageService';
import { GAME_CONFIG } from './lib/config';
import { DEFAULT_GAME_STATE } from './lib/gameState';
import { STORAGE_KEYS, ALARMS, MESSAGES } from './lib/constants';

// =============================================================================
// Extension Lifecycle
// =============================================================================

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Initialize default state on first install
    await chrome.storage.local.set({ [STORAGE_KEYS.GAME_STATE]: DEFAULT_GAME_STATE });
  }

  // Set up periodic health check alarm
  chrome.alarms.create(ALARMS.HEALTH_CHECK, {
    periodInMinutes: GAME_CONFIG.alarms.healthCheckIntervalMinutes,
  });
});

// Open side panel when user clicks the extension icon
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// =============================================================================
// Tab Event Listeners
// =============================================================================

// Debounce mechanism to prevent rapid-fire updates
let tabUpdateTimeout: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 300;

function debouncedTabUpdate() {
  if (tabUpdateTimeout) {
    clearTimeout(tabUpdateTimeout);
  }
  tabUpdateTimeout = setTimeout(async () => {
    const tabs = await chrome.tabs.query({});
    await gameEngine.updateTabCount(tabs.length);
  }, DEBOUNCE_MS);
}

chrome.tabs.onCreated.addListener(() => {
  debouncedTabUpdate();
});

chrome.tabs.onRemoved.addListener(async () => {
  // Feed the goblin immediately (don't debounce XP gain)
  await gameEngine.onTabClosed();
  // Then update tab count (debounced)
  debouncedTabUpdate();
});

chrome.tabs.onUpdated.addListener(() => {
  debouncedTabUpdate();
});

// =============================================================================
// Alarms
// =============================================================================

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARMS.HEALTH_CHECK) {
    await gameEngine.performHealthCheck();
  }
});

// =============================================================================
// Message Handlers (Communication with Side Panel)
// =============================================================================

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case MESSAGES.GET_STATE:
      storageService.getState().then(sendResponse);
      return true; // Keep channel open for async response

    case MESSAGES.TOGGLE_FOCUS_MODE:
      gameEngine.toggleFocusMode().then(sendResponse);
      return true;

    case MESSAGES.REVIVE_GOBLIN:
      gameEngine.reviveGoblin().then(() => sendResponse({ success: true }));
      return true;

    default:
      return false;
  }
});

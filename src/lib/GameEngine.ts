/**
 * Core game logic engine
 * Handles all game mechanics: XP, leveling, health, mood
 * This is the single source of truth for game state mutations
 */

import { GoblinMood, GoblinLevel } from './gameState';
import { GAME_CONFIG } from './config';
import { storageService } from './StorageService';
import { MESSAGES } from './constants';

class GameEngine {
  private recentTabsClosedCount = 0;
  private lastResetTime = Date.now();

  /**
   * Process a tab being closed (feeding the goblin)
   */
  async onTabClosed(): Promise<void> {
    const state = await storageService.getState();

    // Skip if focus mode is active
    if (state.settings.focusModeActive) {
      return;
    }

    // Check if we need to reset diminishing returns counter
    const now = Date.now();
    const minutesSinceReset = (now - this.lastResetTime) / (1000 * 60);
    if (minutesSinceReset >= GAME_CONFIG.diminishingReturns.resetPeriodMinutes) {
      this.recentTabsClosedCount = 0;
      this.lastResetTime = now;
    }

    // Calculate XP with diminishing returns
    let xpGain: number = GAME_CONFIG.xp.basePerTab;
    this.recentTabsClosedCount++;

    if (this.recentTabsClosedCount > GAME_CONFIG.diminishingReturns.startAfterTabs) {
      xpGain = Math.floor(xpGain * GAME_CONFIG.diminishingReturns.multiplier);
    }

    if (xpGain > 0) {
      // Apply XP
      state.pet.xp += xpGain;
      state.stats.totalXP += xpGain;
      state.stats.tabsClosed += 1;

      // Check for level up
      const oldLevel = state.pet.level;
      const newLevel = this.calculateLevel(state.pet.xp, state.pet.level);
      
      // If leveled up, reset XP and notify
      if (newLevel > oldLevel) {
        state.pet.level = newLevel;
        state.pet.xp = 0; // Reset to 0 on level up
        
        // Broadcast level up event
        this.broadcastMessage({ type: MESSAGES.LEVEL_UP, level: newLevel });
      }

      // Health boost
      state.pet.health = Math.min(
        GAME_CONFIG.health.max,
        state.pet.health + GAME_CONFIG.health.boostPerTabClosed
      );
    }

    state.stats.lastActiveTime = Date.now();
    await storageService.setState(state);

    // Notify UI
    this.broadcastMessage({ type: MESSAGES.TAB_CLOSED, xpGain });
  }

  /**
   * Update the environment based on current tab count
   */
  async updateTabCount(tabCount: number): Promise<void> {
    const state = await storageService.getState();

    // Skip mood/corruption updates if focus mode is active
    if (state.settings.focusModeActive) {
      state.environment.tabCount = tabCount; // Still track count for display
      await storageService.setState(state);
      return;
    }

    state.environment.tabCount = tabCount;
    state.environment.waterCleanliness = this.calculateWaterCleanliness(tabCount);
    state.pet.mood = this.calculateMood(tabCount, state.pet.health);

    await storageService.setState(state);
  }

  /**
   * Perform periodic health check (called by alarm)
   */
  async performHealthCheck(): Promise<void> {
    const state = await storageService.getState();
    
    // Skip health checks if focus mode is active
    if (state.settings.focusModeActive) {
      return;
    }

    const now = Date.now();

    // Calculate neglect penalty
    const hoursSinceActive = (now - state.stats.lastActiveTime) / (1000 * 60 * 60);
    if (hoursSinceActive > GAME_CONFIG.health.neglectThresholdHours) {
      state.pet.health = Math.max(0, state.pet.health - GAME_CONFIG.health.neglectDamagePerCheck);
    }

    // Corruption damage from too many tabs
    if (state.environment.tabCount > GAME_CONFIG.tabs.dangerMax) {
      state.pet.health = Math.max(
        0,
        state.pet.health - GAME_CONFIG.health.corruptionDamagePerMinute
      );
    }

    // Check for death
    if (state.pet.health <= 0) {
      state.pet.mood = 'DEAD';
    }

    // Update night mode
    const currentHour = new Date().getHours();
    state.environment.isNight =
      currentHour >= GAME_CONFIG.environment.nightStartHour ||
      currentHour < GAME_CONFIG.environment.nightEndHour;

    await storageService.setState(state);
  }

  /**
   * Revive a dead goblin (reset health, keep level)
   */
  async reviveGoblin(): Promise<void> {
    const state = await storageService.getState();

    if (state.pet.mood === 'DEAD') {
      state.pet.health = 50; // Revive at half health
      state.pet.mood = 'HAPPY';
      state.stats.lastActiveTime = Date.now();
      await storageService.setState(state);
    }
  }

  /**
   * Toggle focus mode (pauses game mechanics)
   */
  async toggleFocusMode(): Promise<boolean> {
    const state = await storageService.getState();
    state.settings.focusModeActive = !state.settings.focusModeActive;
    await storageService.setState(state);
    return state.settings.focusModeActive;
  }

  // --- Private Helper Methods ---

  private calculateLevel(xp: number, currentLevel: GoblinLevel): GoblinLevel {
    if (currentLevel === 1 && xp >= GAME_CONFIG.xp.level2Threshold) {
      return 2;
    }
    if (currentLevel === 2 && xp >= GAME_CONFIG.xp.level3Threshold) {
      return 3;
    }
    return currentLevel;
  }

  private calculateWaterCleanliness(tabCount: number): number {
    if (tabCount > GAME_CONFIG.tabs.dangerMax) {
      return GAME_CONFIG.environment.criticalWater;
    }
    if (tabCount > GAME_CONFIG.tabs.warningMax) {
      return GAME_CONFIG.environment.dangerWater;
    }
    if (tabCount > GAME_CONFIG.tabs.safeMax) {
      return GAME_CONFIG.environment.warningWater;
    }
    return GAME_CONFIG.environment.cleanWater;
  }

  private calculateMood(tabCount: number, health: number): GoblinMood {
    if (health <= 0) {
      return 'DEAD';
    }
    if (tabCount > GAME_CONFIG.tabs.dangerMax) {
      return 'CORRUPT';
    }
    if (tabCount > GAME_CONFIG.tabs.safeMax) {
      return 'GREEDY';
    }
    return 'HAPPY';
  }

  private broadcastMessage(message: object): void {
    try {
      chrome.runtime.sendMessage(message).catch(() => {
        // Side panel might not be open, ignore
      });
    } catch {
      // Ignore errors when no listeners
    }
  }
}

// Export singleton instance
export const gameEngine = new GameEngine();


/**
 * Type-safe wrapper for Chrome Storage API
 * Provides a single point of access for all storage operations
 */

import { GameState, DEFAULT_GAME_STATE } from './gameState';
import { STORAGE_KEYS } from './constants';

class StorageService {
  private cache: GameState | null = null;
  private listeners: Set<(state: GameState) => void> = new Set();

  /**
   * Get the current game state
   * Uses cache if available, otherwise fetches from storage
   */
  async getState(): Promise<GameState> {
    if (this.cache) {
      return this.cache as GameState;
    }

    try {
      const result = await chrome.storage.local.get(STORAGE_KEYS.GAME_STATE);
      const state = result[STORAGE_KEYS.GAME_STATE] || DEFAULT_GAME_STATE;
      this.cache = state;
      return state;
    } catch (error) {
      console.error('Failed to get state from storage:', error);
      return DEFAULT_GAME_STATE;
    }
  }

  /**
   * Save the game state to storage
   * Updates cache and notifies listeners
   */
  async setState(state: GameState): Promise<void> {
    try {
      await chrome.storage.local.set({ [STORAGE_KEYS.GAME_STATE]: state });
      this.cache = state;
      this.notifyListeners(state);
    } catch (error) {
      console.error('Failed to save state to storage:', error);
    }
  }

  /**
   * Update specific fields in the game state
   * Merges with existing state
   */
  async updateState(updates: Partial<GameState>): Promise<GameState> {
    const current = await this.getState();
    const newState = this.deepMerge(current, updates);
    await this.setState(newState);
    return newState;
  }

  /**
   * Subscribe to state changes
   * Returns unsubscribe function
   */
  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Clear the cache (useful for testing or reset)
   */
  clearCache(): void {
    this.cache = null;
  }

  /**
   * Reset game to default state
   */
  async reset(): Promise<void> {
    await this.setState(DEFAULT_GAME_STATE);
  }

  private notifyListeners(state: GameState): void {
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  private deepMerge<T extends object>(target: T, source: Partial<T>): T {
    const result = { ...target };

    for (const key in source) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object'
      ) {
        (result as any)[key] = this.deepMerge(targetValue, sourceValue as any);
      } else if (sourceValue !== undefined) {
        (result as any)[key] = sourceValue;
      }
    }

    return result;
  }
}

// Export singleton instance
export const storageService = new StorageService();


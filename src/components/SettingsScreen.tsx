/**
 * Settings and customization screen
 */

import { useState, memo } from 'react';
import { GameState } from '../lib/gameState';
import { MESSAGES } from '../lib/constants';

interface SettingsScreenProps {
  gameState: GameState;
  onClose: () => void;
  onUpdate: (updates: Partial<GameState>) => void;
}

function SettingsScreenComponent({ gameState, onClose, onUpdate }: SettingsScreenProps) {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(gameState.pet.name);

  const handleSaveName = () => {
    if (newName.trim().length > 0 && newName.trim().length <= 10) {
      onUpdate({
        pet: { ...gameState.pet, name: newName.trim() },
      });
      setEditingName(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset game? This will erase all progress!')) {
      try {
        await chrome.storage.local.clear();
        window.location.reload();
      } catch (error) {
        console.error('Failed to reset:', error);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#0f380f] p-3 text-[#9bbc0f] flex flex-col text-[10px] font-['Press_Start_2P']">
      <div className="flex justify-between items-center mb-3 border-b-2 border-[#9bbc0f] pb-2">
        <h2 className="text-xs">SETTINGS</h2>
        <button onClick={onClose} className="text-xs hover:animate-pulse">✕</button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
        {/* Name Edit */}
        <div>
          <div className="text-xs mb-2 text-[#8bac0f]">NAME</div>
          {editingName ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value.slice(0, 10))}
                maxLength={10}
                className="w-full bg-[#306230] text-[#9bbc0f] px-2 py-1 border-2 border-[#9bbc0f] outline-none font-['Press_Start_2P'] text-[10px]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveName}
                  className="flex-1 bg-[#306230] px-2 py-1 border-2 border-[#9bbc0f] active:translate-y-0.5"
                >
                  SAVE
                </button>
                <button
                  onClick={() => setEditingName(false)}
                  className="flex-1 bg-[#306230] px-2 py-1 border-2 border-[#9bbc0f] active:translate-y-0.5"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-[#8bac0f]">{gameState.pet.name}</span>
              <button
                onClick={() => setEditingName(true)}
                className="text-[8px] bg-[#306230] px-2 py-1 border-2 border-[#9bbc0f] active:translate-y-0.5"
              >
                EDIT
              </button>
            </div>
          )}
        </div>

        {/* Sound */}
        <div>
          <div className="flex justify-between items-center">
            <span>SOUND</span>
            <button
              onClick={() => onUpdate({
                settings: { ...gameState.settings, soundEnabled: !gameState.settings.soundEnabled }
              })}
              className="bg-[#306230] px-2 py-1 border-2 border-[#9bbc0f] active:translate-y-0.5"
            >
              {gameState.settings.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Focus Mode */}
        <div>
          <div className="flex justify-between items-center">
            <span>FOCUS MODE</span>
            <button
              onClick={async () => {
                try {
                  await chrome.runtime.sendMessage({ type: MESSAGES.TOGGLE_FOCUS_MODE });
                } catch (error) {
                  console.error('Failed to toggle focus mode:', error);
                }
              }}
              className="bg-[#306230] px-2 py-1 border-2 border-[#9bbc0f] active:translate-y-0.5"
            >
              {gameState.settings.focusModeActive ? 'ON' : 'OFF'}
            </button>
          </div>
          <p className="text-[8px] mt-1 opacity-75">PAUSES GAME</p>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-[#306230]" />

        {/* Danger Zone */}
        <div>
          <div className="text-xs mb-2 text-red-400">DANGER ZONE</div>
          <button
            onClick={handleReset}
            className="w-full bg-red-900 px-2 py-1 border-2 border-red-400 text-red-400 active:translate-y-0.5"
          >
            RESET GAME
          </button>
          <p className="text-[8px] mt-1 opacity-75">ERASES ALL DATA</p>
        </div>

        {/* About */}
        <div className="text-[8px] opacity-50 space-y-1">
          <p>TAB GOBLIN v0.2.0</p>
          <p>BY DANTE ARCENEAUX</p>
          <p className="text-[6px]">GITHUB.COM/DANTEARCENEAUX</p>
        </div>
      </div>

      <div className="mt-3 text-center text-[8px] animate-pulse">
        PRESS B TO CLOSE
      </div>
    </div>
  );
}

export const SettingsScreen = memo(SettingsScreenComponent);


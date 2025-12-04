/**
 * Statistics and Achievements Screen
 */

import { GameState } from '../lib/gameState';

interface StatsScreenProps {
  gameState: GameState;
  onClose: () => void;
}

export function StatsScreen({ gameState, onClose }: StatsScreenProps) {
  const playtime = Math.floor((Date.now() - (gameState.stats.firstPlayTime || Date.now())) / 1000 / 60);

  return (
    <div className="absolute inset-0 z-50 bg-[#0f380f] p-3 text-[#9bbc0f] flex flex-col text-[10px] font-['Press_Start_2P'] slide-down">
      <div className="flex justify-between items-center mb-3 border-b-2 border-[#9bbc0f] pb-2">
        <h2 className="text-xs">STATS</h2>
        <button onClick={onClose} className="text-xs hover:animate-pulse">✕</button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
        {/* Main Stats */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>NAME:</span>
            <span className="text-[#8bac0f]">{gameState.pet.name}</span>
          </div>
          <div className="flex justify-between">
            <span>LEVEL:</span>
            <span className="text-[#8bac0f]">{gameState.pet.level}</span>
          </div>
          <div className="flex justify-between">
            <span>HEALTH:</span>
            <span className="text-[#8bac0f]">{gameState.pet.health}%</span>
          </div>
          <div className="flex justify-between">
            <span>MOOD:</span>
            <span className="text-[#8bac0f]">{gameState.pet.mood}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-[#306230]" />

        {/* Lifetime Stats */}
        <div className="space-y-1">
          <div className="text-xs mb-1 text-[#8bac0f]">LIFETIME</div>
          <div className="flex justify-between">
            <span>TABS CLOSED:</span>
            <span className="text-[#8bac0f]">{gameState.stats.tabsClosed}</span>
          </div>
          <div className="flex justify-between">
            <span>TOTAL XP:</span>
            <span className="text-[#8bac0f]">{gameState.stats.totalXP}</span>
          </div>
          <div className="flex justify-between">
            <span>PLAY TIME:</span>
            <span className="text-[#8bac0f]">{playtime}M</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-[#306230]" />

        {/* Achievements */}
        <div className="space-y-1">
          <div className="text-xs mb-1 text-[#8bac0f]">BADGES</div>
          <div className="grid grid-cols-3 gap-2">
            {gameState.stats.tabsClosed >= 10 && (
              <div className="bg-[#306230] p-2 rounded text-center text-[8px]">
                <div className="text-sm mb-1">🌟</div>
                STARTER
              </div>
            )}
            {gameState.stats.tabsClosed >= 50 && (
              <div className="bg-[#306230] p-2 rounded text-center text-[8px]">
                <div className="text-sm mb-1">⭐</div>
                CLEANER
              </div>
            )}
            {gameState.stats.tabsClosed >= 100 && (
              <div className="bg-[#306230] p-2 rounded text-center text-[8px]">
                <div className="text-sm mb-1">✨</div>
                MASTER
              </div>
            )}
            {gameState.pet.level >= 2 && (
              <div className="bg-[#306230] p-2 rounded text-center text-[8px]">
                <div className="text-sm mb-1">🎖️</div>
                EVOLVED
              </div>
            )}
            {gameState.pet.level >= 3 && (
              <div className="bg-[#306230] p-2 rounded text-center text-[8px]">
                <div className="text-sm mb-1">👑</div>
                MAX LVL
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 text-center text-[8px] animate-pulse">
        PRESS B TO CLOSE
      </div>
    </div>
  );
}


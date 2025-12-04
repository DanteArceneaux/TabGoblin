/**
 * Main Tab Goblin Side Panel Application
 * Refactored with Retro Console UI
 */

import { useEffect, useState, useCallback } from 'react';
import '@fontsource/press-start-2p';
import { Goblin } from './components/Goblin';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ConsoleWrapper } from './components/ConsoleWrapper';
import { Particle, FallingTab } from './components/Particle';
import { StatsScreen } from './components/StatsScreen';
import { useChromeStorage } from './hooks/useChromeStorage';
import { GameState, DEFAULT_GAME_STATE } from './lib/gameState';
import { STORAGE_KEYS, MESSAGES } from './lib/constants';
import { GAME_CONFIG } from './lib/config';
import { soundEngine } from './lib/SoundEngine';

function AppContent() {
  const [gameState, setGameState] = useChromeStorage<GameState>(
    STORAGE_KEYS.GAME_STATE,
    DEFAULT_GAME_STATE
  );
  const [isEating, setIsEating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [fallingTabs, setFallingTabs] = useState<number[]>([]);

  // Check for first run
  useEffect(() => {
    if (gameState.settings.isFirstRun) {
      setShowWelcome(true);
    }
  }, [gameState.settings.isFirstRun]);

  // Listen for events from background script
  useEffect(() => {
    const messageListener = (message: { type: string; xpGain?: number }) => {
      if (message.type === MESSAGES.TAB_CLOSED) {
        // Trigger eating animation
        setIsEating(true);
        soundEngine.playMunch();

        // Add falling tab
        setFallingTabs((prev) => [...prev, Date.now()]);

        // Add particle
        setParticles((prev) => [
          ...prev,
          { id: Date.now(), x: Math.random() * 100 + 50, y: 100 },
        ]);

        setTimeout(() => {
          setIsEating(false);
        }, GAME_CONFIG.animation.eatingDurationMs);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  // Update sound engine when settings change
  useEffect(() => {
    soundEngine.setEnabled(gameState.settings.soundEnabled);
  }, [gameState.settings.soundEnabled]);

  const handleCloseWelcome = useCallback(() => {
    setShowWelcome(false);
    setGameState({
      ...gameState,
      settings: { ...gameState.settings, isFirstRun: false },
    });
  }, [gameState, setGameState]);

  const toggleSound = useCallback(() => {
    setGameState({
      ...gameState,
      settings: {
        ...gameState.settings,
        soundEnabled: !gameState.settings.soundEnabled,
      },
    });
  }, [gameState, setGameState]);

  const handleRevive = useCallback(async () => {
    try {
      await chrome.runtime.sendMessage({ type: 'REVIVE_GOBLIN' });
    } catch (error) {
      console.error('Failed to revive goblin:', error);
    }
  }, []);

  const handleAButton = useCallback(() => {
    if (gameState.pet.mood === 'DEAD') {
      handleRevive();
    } else {
      // Poke the goblin?
      soundEngine.playChirp();
    }
  }, [gameState.pet.mood, handleRevive]);

  const handleStartButton = useCallback(() => {
    setShowStats((prev) => !prev);
  }, []);

  const handleSelectButton = useCallback(async () => {
    // Toggle focus mode
    try {
      await chrome.runtime.sendMessage({ type: 'TOGGLE_FOCUS_MODE' });
    } catch (error) {
      console.error('Failed to toggle focus mode:', error);
    }
  }, []);

  const handleParticleComplete = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleTabComplete = useCallback((id: number) => {
    setFallingTabs((prev) => prev.filter((t) => t !== id));
  }, []);

  const getXpMax = () => {
    if (gameState.pet.level === 1) return GAME_CONFIG.xp.level2Threshold;
    if (gameState.pet.level === 2) return GAME_CONFIG.xp.level3Threshold;
    return 100; // Max level
  };

  // Game Boy Green Palette
  // Darkest: #0f380f
  // Dark: #306230
  // Light: #8bac0f
  // Lightest: #9bbc0f

  return (
    <ConsoleWrapper
      onAButton={handleAButton}
      onBButton={showStats ? () => setShowStats(false) : toggleSound}
      onStart={handleStartButton}
      onSelect={handleSelectButton}
      soundEnabled={gameState.settings.soundEnabled}
      mood={gameState.pet.mood}
    >
      <div className="flex-1 flex flex-col font-['Press_Start_2P'] text-[#0f380f]">
        
        {/* Top Status Bar */}
        <div className="flex justify-between items-center p-2 border-b-2 border-[#0f380f] bg-[#8bac0f]">
          <div className="text-[10px]">LVL {gameState.pet.level}</div>
          <div className="text-[10px]">{gameState.environment.tabCount} TABS</div>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Falling tabs */}
          {fallingTabs.map((id) => (
            <FallingTab key={id} onComplete={() => handleTabComplete(id)} />
          ))}

          {/* Particles */}
          {particles.map((particle) => (
            <Particle
              key={particle.id}
              x={particle.x}
              y={particle.y}
              onComplete={() => handleParticleComplete(particle.id)}
            />
          ))}
          
          <div className="transform scale-150">
            <Goblin level={gameState.pet.level} mood={gameState.pet.mood} isEating={isEating} />
          </div>

          {gameState.pet.mood === 'DEAD' && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0f380f] bg-opacity-50">
              <div className="text-center text-[#9bbc0f] p-2 bg-[#0f380f] border-2 border-[#9bbc0f]">
                <p className="text-xs mb-2">GAME OVER</p>
                <p className="text-[8px] animate-pulse">PRESS A</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Stats Area */}
        <div className="p-2 bg-[#8bac0f] border-t-2 border-[#0f380f]">
          {/* Name and Mood */}
          <div className="flex justify-between items-center mb-2 text-[10px]">
            <span>{gameState.pet.name}</span>
            <span>{gameState.pet.mood}</span>
          </div>

          {/* Bars */}
          <div className="space-y-1">
            {/* Health */}
            <div className="flex items-center gap-1">
              <span className="text-[8px] w-8">HP</span>
              <div className="flex-1 h-2 border-2 border-[#0f380f] p-[1px]">
                <div 
                  className="h-full bg-[#0f380f] transition-all duration-300"
                  style={{ width: `${gameState.pet.health}%` }}
                />
              </div>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1">
              <span className="text-[8px] w-8">XP</span>
              <div className="flex-1 h-2 border-2 border-[#0f380f] p-[1px]">
                <div 
                  className="h-full bg-[#306230] transition-all duration-300"
                  style={{ width: `${(gameState.pet.xp / getXpMax()) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Screen */}
        {showStats && <StatsScreen gameState={gameState} onClose={() => setShowStats(false)} />}

        {/* Welcome Modal (Retro Style) */}
        {showWelcome && (
          <div className="absolute inset-0 z-50 bg-[#0f380f] p-4 text-[#9bbc0f] flex flex-col items-center text-center">
            <h2 className="text-sm mb-4 mt-4 border-b-2 border-[#9bbc0f] pb-2 w-full">TAB GOBLIN</h2>
            <div className="flex-1 text-[10px] leading-relaxed space-y-4 overflow-y-auto scrollbar-hide">
              <p>HELLO TRAINER!</p>
              <p>I LIVE IN YOUR TABS.</p>
              <p>CLOSE TABS = YUMMY XP</p>
              <p>TOO MANY TABS = SICK</p>
              <p className="text-[8px] opacity-75 mt-4">PRESS START FOR INFO</p>
            </div>
            <button
              onClick={handleCloseWelcome}
              className="mt-4 mb-2 text-xs animate-pulse"
            >
              ▶ PRESS A TO START
            </button>
          </div>
        )}
      </div>
    </ConsoleWrapper>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;

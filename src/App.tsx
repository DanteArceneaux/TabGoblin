/**
 * Main Tab Goblin Side Panel Application
 * Polished with CRT boot, interactive tutorial, and juice
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import '@fontsource/press-start-2p';
import { Goblin } from './components/Goblin';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ConsoleWrapper } from './components/ConsoleWrapper';
import { Particle, FallingTab } from './components/Particle';
import { StatsScreen } from './components/StatsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { CRTBoot } from './components/CRTBoot';
import { Tutorial } from './components/Tutorial';
import { EvolutionSequence } from './components/EvolutionSequence';
import { useChromeStorage } from './hooks/useChromeStorage';
import { GameState, DEFAULT_GAME_STATE } from './lib/gameState';
import { STORAGE_KEYS, MESSAGES } from './lib/constants';
import { GAME_CONFIG } from './lib/config';
import { soundEngine } from './lib/SoundEngine';

function AppContent() {
  const [gameState, setGameState, isLoading] = useChromeStorage<GameState>(
    STORAGE_KEYS.GAME_STATE,
    DEFAULT_GAME_STATE
  );
  
  // UI States
  const [isEating, setIsEating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [fallingTabs, setFallingTabs] = useState<number[]>([]);
  const [particleIdCounter, setParticleIdCounter] = useState(0);
  
  // Animation States
  const [bootComplete, setBootComplete] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolutionLevels, setEvolutionLevels] = useState<{ from: number; to: number } | null>(null);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isReviving, setIsReviving] = useState(false);
  const [reaction, setReaction] = useState<'happy' | 'sad' | 'stress' | null>(null);
  const [tutorialAPressed, setTutorialAPressed] = useState(false);
  
  // Refs
  const lastInteractionRef = useRef<number>(Date.now());
  const previousLevelRef = useRef<number>(gameState.pet.level);
  const previousMoodRef = useRef<string>(gameState.pet.mood);

  // Check for first run - show tutorial
  useEffect(() => {
    if (gameState.settings.isFirstRun && bootComplete) {
      setShowTutorial(true);
    }
  }, [gameState.settings.isFirstRun, bootComplete]);

  // Idle sleep detection (20 seconds of no interaction)
  useEffect(() => {
    if (gameState.pet.mood === 'DEAD' || showTutorial || showStats || showSettings) {
      setIsSleeping(false);
      return;
    }

    const checkIdle = setInterval(() => {
      const idleTime = Date.now() - lastInteractionRef.current;
      if (idleTime > 20000 && !isSleeping) {
        setIsSleeping(true);
      }
    }, 1000);

    return () => clearInterval(checkIdle);
  }, [gameState.pet.mood, showTutorial, showStats, showSettings, isSleeping]);

  // Wake up on any interaction
  const wakeUp = useCallback(() => {
    lastInteractionRef.current = Date.now();
    if (isSleeping) {
      setIsSleeping(false);
    }
  }, [isSleeping]);

  // Detect evolution (level 3 or 7 reached)
  useEffect(() => {
    const currentLevel = gameState.pet.level;
    const prevLevel = previousLevelRef.current;
    
    // Check if we crossed an evolution threshold
    if (currentLevel !== prevLevel) {
      const evolutionThresholds = [3, 7];
      const crossedThreshold = evolutionThresholds.find(
        threshold => prevLevel < threshold && currentLevel >= threshold
      );
      
      if (crossedThreshold) {
        setEvolutionLevels({ from: prevLevel, to: currentLevel });
        setShowEvolution(true);
      }
      
      previousLevelRef.current = currentLevel;
    }
  }, [gameState.pet.level]);

  // Detect mood changes for reactions and sounds
  useEffect(() => {
    const currentMood = gameState.pet.mood;
    const prevMood = previousMoodRef.current;
    
    if (currentMood !== prevMood) {
      // Play appropriate sound
      if (currentMood === 'DEAD' && prevMood !== 'DEAD') {
        soundEngine.playDeath();
      } else if (currentMood === 'CORRUPT' && prevMood !== 'CORRUPT') {
        soundEngine.playGlitch();
        setReaction('stress');
        setTimeout(() => setReaction(null), 500);
      } else if (currentMood === 'GREEDY' && prevMood === 'HAPPY') {
        soundEngine.playWhimper();
        setReaction('sad');
        setTimeout(() => setReaction(null), 500);
      }
      
      previousMoodRef.current = currentMood;
    }
  }, [gameState.pet.mood]);

  // Listen for events from background script
  useEffect(() => {
    const messageListener = (message: { type: string; xpGain?: number; level?: number }) => {
      if (message.type === MESSAGES.TAB_CLOSED) {
        wakeUp();
        setIsEating(true);
        soundEngine.playMunch();
        setReaction('happy');

        // Add falling tab
        setParticleIdCounter((prev) => prev + 1);
        const tabId = Date.now() + particleIdCounter;
        setFallingTabs((prev) => [...prev, tabId]);

        // Add XP particle
        setParticleIdCounter((prev) => prev + 1);
        const particleId = Date.now() + particleIdCounter + 1;
        setParticles((prev) => [
          ...prev,
          { id: particleId, x: Math.random() * 100 + 50, y: 100 },
        ]);

        setTimeout(() => {
          setIsEating(false);
          setReaction(null);
        }, GAME_CONFIG.animation.eatingDurationMs);
      }

      if (message.type === MESSAGES.LEVEL_UP) {
        wakeUp();
        soundEngine.playLevelUp();
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, [particleIdCounter, wakeUp]);

  // Update sound engine when settings change
  useEffect(() => {
    soundEngine.setEnabled(gameState.settings.soundEnabled);
  }, [gameState.settings.soundEnabled]);

  const handleCloseTutorial = useCallback(() => {
    setShowTutorial(false);
    setGameState({
      ...gameState,
      settings: { ...gameState.settings, isFirstRun: false },
    });
  }, [gameState, setGameState]);

  const toggleSound = useCallback(() => {
    wakeUp();
    setGameState({
      ...gameState,
      settings: {
        ...gameState.settings,
        soundEnabled: !gameState.settings.soundEnabled,
      },
    });
  }, [gameState, setGameState, wakeUp]);

  const handleRevive = useCallback(async () => {
    wakeUp();
    setIsReviving(true);
    soundEngine.playRevive();
    
    try {
      await chrome.runtime.sendMessage({ type: MESSAGES.REVIVE_GOBLIN });
    } catch (error) {
      console.error('Failed to revive goblin:', error);
    }
    
    setTimeout(() => {
      setIsReviving(false);
    }, 800);
  }, [wakeUp]);

  const handleAButton = useCallback(() => {
    wakeUp();
    
    // Tutorial: signal A was pressed
    if (showTutorial) {
      setTutorialAPressed(true);
      return;
    }

    if (gameState.pet.mood === 'DEAD') {
      handleRevive();
    } else {
      soundEngine.playChirp();
    }
  }, [showTutorial, gameState.pet.mood, handleRevive, wakeUp]);

  const handleStartButton = useCallback(() => {
    wakeUp();
    if (showSettings) {
      setShowSettings(false);
    } else if (showStats) {
      setShowStats(false);
      setShowSettings(true);
    } else {
      setShowStats(true);
    }
  }, [showStats, showSettings, wakeUp]);

  const handleSelectButton = useCallback(async () => {
    wakeUp();
    try {
      await chrome.runtime.sendMessage({ type: MESSAGES.TOGGLE_FOCUS_MODE });
    } catch (error) {
      console.error('Failed to toggle focus mode:', error);
    }
  }, [wakeUp]);

  const handleParticleComplete = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleTabComplete = useCallback((id: number) => {
    setFallingTabs((prev) => prev.filter((t) => t !== id));
  }, []);

  const getXpMax = () => {
    if (gameState.pet.level === 1) return GAME_CONFIG.xp.level2Threshold;
    if (gameState.pet.level === 2) return GAME_CONFIG.xp.level3Threshold;
    return 100;
  };

  // Show loading state
  if (isLoading) {
    return (
      <ConsoleWrapper soundEnabled={false} mood="HAPPY">
        <div className="flex-1 flex items-center justify-center bg-[#9bbc0f]">
          <div className="text-[#0f380f] text-xs font-['Press_Start_2P'] animate-pulse">
            LOADING...
          </div>
        </div>
      </ConsoleWrapper>
    );
  }

  return (
    <ConsoleWrapper
      onAButton={handleAButton}
      onBButton={showStats ? () => { wakeUp(); setShowStats(false); } : toggleSound}
      onStart={handleStartButton}
      onSelect={handleSelectButton}
      soundEnabled={gameState.settings.soundEnabled}
      mood={gameState.pet.mood}
    >
      <CRTBoot onBootComplete={() => setBootComplete(true)}>
        <div className="flex-1 flex flex-col font-['Press_Start_2P'] text-[#0f380f] bg-[#9bbc0f]">
          
          {/* Top Status Bar */}
          <div className="flex justify-between items-center p-2 border-b-2 border-[#0f380f] bg-[#8bac0f]">
            <div className="text-[10px] flex items-center gap-1">
              LVL {gameState.pet.level}
              {gameState.settings.focusModeActive && (
                <span className="text-[8px] ml-1 opacity-75">💤</span>
              )}
              {isSleeping && !gameState.settings.focusModeActive && (
                <span className="text-[8px] ml-1 opacity-75">😴</span>
              )}
            </div>
            <div className="text-[10px]">{gameState.environment.tabCount} TABS</div>
          </div>

          {/* Main Game Area */}
          <div className={`flex-1 flex items-center justify-center relative overflow-hidden ${
            gameState.environment.isNight ? 'bg-[#8bac0f]' : ''
          }`}>
            {/* Night mode stars */}
            {gameState.environment.isNight && (
              <>
                <div className="absolute top-4 left-8 text-[#306230] text-xs animate-pulse">✦</div>
                <div className="absolute top-12 right-12 text-[#306230] text-xs animate-pulse delay-100">✦</div>
                <div className="absolute bottom-20 left-16 text-[#306230] text-xs animate-pulse delay-200">✦</div>
                <div className="absolute top-20 right-8 text-[#0f380f] text-[8px] animate-pulse delay-150">✧</div>
              </>
            )}
            
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
            
            {/* The Goblin */}
            <div className="transform scale-150">
              <Goblin 
                level={gameState.pet.level} 
                mood={gameState.pet.mood} 
                isEating={isEating}
                isSleeping={isSleeping && gameState.pet.mood === 'HAPPY'}
                isReviving={isReviving}
                reaction={reaction}
              />
            </div>

            {/* Death Overlay */}
            {gameState.pet.mood === 'DEAD' && !isReviving && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0f380f] bg-opacity-60 slide-down">
                <div className="text-center text-[#9bbc0f] p-3 bg-[#0f380f] border-2 border-[#9bbc0f]">
                  <p className="text-xs mb-2">GAME OVER</p>
                  <p className="text-[8px] animate-pulse">PRESS (A) TO REVIVE</p>
                </div>
              </div>
            )}

            {/* Evolution Sequence */}
            {showEvolution && evolutionLevels && (
              <EvolutionSequence
                fromLevel={evolutionLevels.from}
                toLevel={evolutionLevels.to}
                onComplete={() => {
                  setShowEvolution(false);
                  setEvolutionLevels(null);
                }}
              />
            )}
          </div>

          {/* Bottom Stats Area */}
          <div className="p-2 bg-[#8bac0f] border-t-2 border-[#0f380f]">
            {/* Name and Mood */}
            <div className="flex justify-between items-center mb-2 text-[10px]">
              <span>{gameState.pet.name}</span>
              <span className={gameState.pet.mood === 'DEAD' ? 'text-red-800' : ''}>
                {gameState.pet.mood}
              </span>
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

          {/* Settings Screen */}
          {showSettings && (
            <SettingsScreen
              gameState={gameState}
              onClose={() => setShowSettings(false)}
              onUpdate={(updates) => setGameState({ ...gameState, ...updates })}
            />
          )}

          {/* Interactive Tutorial */}
          {showTutorial && (
            <Tutorial
              tabCount={gameState.environment.tabCount}
              onComplete={handleCloseTutorial}
              onAButtonPressed={tutorialAPressed}
            />
          )}
        </div>
      </CRTBoot>
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

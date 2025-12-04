/**
 * Main Tab Goblin Side Panel Application
 */

import { useEffect, useState } from 'react';
import { Goblin } from './components/Goblin';
import { useChromeStorage } from './hooks/useChromeStorage';
import { GameState, DEFAULT_GAME_STATE } from './lib/gameState';
import { STORAGE_KEYS, MESSAGES } from './lib/constants';
import { soundEngine } from './lib/SoundEngine';

function App() {
  const [gameState, setGameState] = useChromeStorage<GameState>(
    STORAGE_KEYS.GAME_STATE,
    DEFAULT_GAME_STATE
  );
  const [isEating, setIsEating] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check for first run
  useEffect(() => {
    if (gameState.settings.isFirstRun) {
      setShowWelcome(true);
    }
  }, [gameState.settings.isFirstRun]);

  // Listen for tab close events from background
  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.type === MESSAGES.TAB_CLOSED) {
        // Trigger eating animation
        setIsEating(true);
        soundEngine.playMunch();
        
        setTimeout(() => {
          setIsEating(false);
        }, 600);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  // Update sound engine when settings change
  useEffect(() => {
    soundEngine.setEnabled(gameState.settings.soundEnabled);
  }, [gameState.settings.soundEnabled]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    setGameState({
      ...gameState,
      settings: { ...gameState.settings, isFirstRun: false },
    });
  };

  const toggleSound = () => {
    setGameState({
      ...gameState,
      settings: {
        ...gameState.settings,
        soundEnabled: !gameState.settings.soundEnabled,
      },
    });
  };

  const getBackgroundClass = () => {
    if (gameState.environment.waterCleanliness < 40) {
      return 'bg-gradient-to-b from-red-900 to-gray-900';
    }
    if (gameState.environment.waterCleanliness < 70) {
      return 'bg-gradient-to-b from-orange-800 to-gray-800';
    }
    return 'bg-gradient-to-b from-blue-900 to-purple-900';
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} transition-colors duration-1000 relative overflow-hidden`}>
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md text-white">
            <h2 className="text-2xl font-bold mb-4">Welcome to Tab Goblin!</h2>
            <p className="mb-4">
              Meet your new browser companion! I'll live here in your side panel and react to your browsing habits.
            </p>
            <p className="mb-4">
              <strong>How it works:</strong>
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Close tabs to feed me and earn XP</li>
              <li>Keep tabs low (under 10) to keep me happy</li>
              <li>Too many tabs will make me sick!</li>
            </ul>
            <p className="text-sm mb-4 text-gray-400">
              Note: I only count your tabs. I cannot read their content or your browsing history.
            </p>
            <button
              onClick={handleCloseWelcome}
              className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold"
            >
              Let's Go!
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {/* Settings */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleSound}
            className="text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-75 px-3 py-2 rounded"
            title={gameState.settings.soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {gameState.settings.soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>

        {/* Goblin */}
        <div className="mb-8">
          <Goblin
            level={gameState.pet.level}
            mood={gameState.pet.mood}
            isEating={isEating}
          />
        </div>

        {/* Stats */}
        <div className="bg-gray-800 bg-opacity-80 rounded-lg p-4 w-full max-w-xs text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">{gameState.pet.name}</span>
            <span className="text-sm">Level {gameState.pet.level}</span>
          </div>

          {/* Health Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Health</span>
              <span>{gameState.pet.health}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${gameState.pet.health}%` }}
              />
            </div>
          </div>

          {/* XP Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>XP</span>
              <span>{gameState.pet.xp}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${gameState.pet.xp}%` }}
              />
            </div>
          </div>

          {/* Tab Count */}
          <div className="text-center mt-4 pt-4 border-t border-gray-700">
            <div className="text-2xl font-bold">{gameState.environment.tabCount}</div>
            <div className="text-xs text-gray-400">Open Tabs</div>
          </div>

          {/* Mood Indicator */}
          <div className="text-center mt-2">
            <span className="text-xs px-2 py-1 rounded bg-gray-700">
              {gameState.pet.mood}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


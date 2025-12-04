/**
 * Pokemon-style evolution sequence overlay
 * Shows flashing animation and plays triumphant jingle
 */

import { useEffect, useState } from 'react';
import { soundEngine } from '../lib/SoundEngine';

interface EvolutionSequenceProps {
  fromLevel: number;
  toLevel: number;
  onComplete: () => void;
}

export function EvolutionSequence({ fromLevel: _fromLevel, toLevel, onComplete }: EvolutionSequenceProps) {
  const [phase, setPhase] = useState<'flash' | 'text' | 'done'>('flash');

  const getEvolutionName = (level: number): string => {
    if (level >= 7) return 'MONSTER';
    if (level >= 3) return 'TEEN';
    return 'BABY';
  };

  useEffect(() => {
    // Play evolution jingle
    soundEngine.playEvolution();

    // Flash phase
    const textTimer = setTimeout(() => {
      setPhase('text');
    }, 1500);

    // Complete
    const completeTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* White flash overlay */}
      {phase === 'flash' && (
        <div className="absolute inset-0 bg-white evolution-flash" />
      )}

      {/* Evolution text */}
      {phase === 'text' && (
        <div className="absolute inset-0 bg-[#0f380f] bg-opacity-90 flex flex-col items-center justify-center font-['Press_Start_2P'] text-[#9bbc0f]">
          <div className="text-center space-y-4">
            <p className="text-[10px] animate-pulse">WHAT?</p>
            <p className="text-xs">YOUR GOBLIN</p>
            <p className="text-xs">IS EVOLVING!</p>
            
            <div className="my-6 text-4xl evolution-pulse">🦎</div>
            
            <p className="text-[10px]">EVOLVED INTO</p>
            <p className="text-lg text-[#9bbc0f]">{getEvolutionName(toLevel)}!</p>
            
            {/* Sparkles */}
            <div className="flex justify-center gap-2 mt-4">
              <span className="animate-pulse delay-100">✦</span>
              <span className="animate-pulse delay-200">★</span>
              <span className="animate-pulse">✦</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


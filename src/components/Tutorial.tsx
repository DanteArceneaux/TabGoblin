/**
 * Interactive 4-step tutorial for first-time users
 * Replaces the static welcome text wall
 */

import { useState, useEffect } from 'react';

interface TutorialProps {
  tabCount: number;
  onComplete: () => void;
  aPressCount: number;
}

type TutorialStep = 'intro' | 'show-tabs' | 'press-a' | 'success' | 'done';

export function Tutorial({ tabCount, onComplete, aPressCount }: TutorialProps) {
  const [step, setStep] = useState<TutorialStep>('intro');
  const [showContent, setShowContent] = useState(false);
  const [consumedAPresses, setConsumedAPresses] = useState(0);

  // Fade in content
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Progress through steps
  useEffect(() => {
    if (step === 'intro') {
      const timer = setTimeout(() => setStep('show-tabs'), 1500);
      return () => clearTimeout(timer);
    }
    if (step === 'show-tabs') {
      const timer = setTimeout(() => setStep('press-a'), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // React to A button press
  useEffect(() => {
    if (step === 'press-a' && aPressCount > consumedAPresses) {
      setConsumedAPresses(aPressCount);
      setStep('success');
    }
  }, [aPressCount, consumedAPresses, step]);

  // Complete tutorial after success
  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => {
        setStep('done');
        setTimeout(onComplete, 300);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <div 
      className={`absolute inset-0 z-50 bg-[#0f380f] flex flex-col items-center justify-center text-[#9bbc0f] font-['Press_Start_2P'] transition-opacity duration-300 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Step: Intro */}
      {step === 'intro' && (
        <div className="text-center animate-pulse">
          <div className="text-lg mb-4">🦎</div>
          <p className="text-xs">HELLO...</p>
        </div>
      )}

      {/* Step: Show tab count */}
      {step === 'show-tabs' && (
        <div className="text-center space-y-4">
          <p className="text-[10px] text-[#8bac0f]">YOU HAVE</p>
          <p className="text-2xl">{tabCount}</p>
          <p className="text-[10px] text-[#8bac0f]">TABS OPEN!</p>
          {tabCount > 10 && (
            <p className="text-[8px] mt-4 animate-pulse">THAT'S A LOT...</p>
          )}
        </div>
      )}

      {/* Step: Press A instruction */}
      {step === 'press-a' && (
        <div className="text-center space-y-6">
          <div className="text-4xl">🦎</div>
          <p className="text-[10px]">I EAT CLOSED TABS</p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-xs pulse-arrow">▶</span>
            <span className="text-xs">PRESS</span>
            <span className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-rose-900 font-bold pulse-glow text-rose-500">
              A
            </span>
          </div>
          <p className="text-[8px] text-[#8bac0f] mt-2">TO FEED ME!</p>
        </div>
      )}

      {/* Step: Success feedback */}
      {step === 'success' && (
        <div className="text-center space-y-4">
          <div className="text-4xl happy-bounce">🦎</div>
          <p className="text-sm text-[#9bbc0f]">YUM!</p>
          <p className="text-xs">+5 XP</p>
          <p className="text-[8px] text-[#8bac0f] mt-4">KEEP ME FED!</p>
        </div>
      )}

      {/* Step: Done (fading out) */}
      {step === 'done' && (
        <div className="text-center opacity-50">
          <p className="text-xs">GOOD LUCK!</p>
        </div>
      )}

      {/* Skip button (only during early steps) */}
      {(step === 'intro' || step === 'show-tabs') && (
        <button
          onClick={onComplete}
          className="absolute bottom-4 text-[8px] text-[#8bac0f] opacity-50 hover:opacity-100 transition-opacity"
        >
          SKIP ▶
        </button>
      )}
    </div>
  );
}


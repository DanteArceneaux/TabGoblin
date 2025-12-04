/**
 * CRT Boot-up animation wrapper
 * Simulates a CRT monitor turning on when the extension opens
 */

import { useState, useEffect, ReactNode } from 'react';
import { soundEngine } from '../lib/SoundEngine';

interface CRTBootProps {
  children: ReactNode;
  onBootComplete?: () => void;
  skip?: boolean;
}

export function CRTBoot({ children, onBootComplete, skip = false }: CRTBootProps) {
  const [bootPhase, setBootPhase] = useState<'off' | 'booting' | 'flicker' | 'ready'>(
    skip ? 'ready' : 'off'
  );

  useEffect(() => {
    if (skip) {
      setBootPhase('ready');
      return;
    }

    // Phase 1: Start boot animation
    const startBoot = setTimeout(() => {
      setBootPhase('booting');
      soundEngine.playPowerOn();
    }, 100);

    // Phase 2: Flicker effect
    const flickerStart = setTimeout(() => {
      setBootPhase('flicker');
    }, 700);

    // Phase 3: Ready
    const readyStart = setTimeout(() => {
      setBootPhase('ready');
      onBootComplete?.();
    }, 1000);

    return () => {
      clearTimeout(startBoot);
      clearTimeout(flickerStart);
      clearTimeout(readyStart);
    };
  }, [skip, onBootComplete]);

  // Render based on boot phase
  if (bootPhase === 'off') {
    return (
      <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-0 h-0 bg-[#9bbc0f]" />
      </div>
    );
  }

  if (bootPhase === 'booting') {
    return (
      <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
        <div className="w-full bg-[#9bbc0f] crt-boot">
          {children}
        </div>
      </div>
    );
  }

  if (bootPhase === 'flicker') {
    return (
      <div className="w-full h-full crt-flicker">
        {children}
      </div>
    );
  }

  // Ready - just render children
  return <>{children}</>;
}


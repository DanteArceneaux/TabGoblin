/**
 * CRT Boot-up animation wrapper
 * Minimal version - just fires onBootComplete without visual transitions
 * to prevent screen flickering/blinking
 */

import { useEffect, ReactNode } from 'react';

interface CRTBootProps {
  children: ReactNode;
  onBootComplete?: () => void;
  skip?: boolean;
}

export function CRTBoot({ children, onBootComplete, skip = false }: CRTBootProps) {
  useEffect(() => {
    // Fire onBootComplete after a minimal delay (allows React to settle)
    const timer = setTimeout(() => {
      onBootComplete?.();
    }, skip ? 0 : 50);

    return () => clearTimeout(timer);
  }, [skip, onBootComplete]);

  // Always render children immediately - no phase transitions
  return <>{children}</>;
}


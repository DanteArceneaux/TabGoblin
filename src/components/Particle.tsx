/**
 * Particle effect component for tab eating animation
 */

import { useEffect, useState } from 'react';

interface ParticleProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export function Particle({ x, y, onComplete }: ParticleProps) {
  const [opacity, setOpacity] = useState(1);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const animation = setInterval(() => {
      setOpacity((prev) => Math.max(0, prev - 0.1));
      setTranslateY((prev) => prev - 3);
    }, 50);

    setTimeout(() => {
      clearInterval(animation);
      onComplete();
    }, 500);

    return () => clearInterval(animation);
  }, [onComplete]);

  return (
    <div
      className="absolute text-[#0f380f] font-bold text-xs pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      +XP
    </div>
  );
}

interface FallingTabProps {
  onComplete: () => void;
}

export function FallingTab({ onComplete }: FallingTabProps) {
  const [translateY, setTranslateY] = useState(-20);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const animation = setInterval(() => {
      setTranslateY((prev) => prev + 10);
      setRotation((prev) => prev + 20);
    }, 50);

    setTimeout(() => {
      clearInterval(animation);
      onComplete();
    }, 600);

    return () => clearInterval(animation);
  }, [onComplete]);

  return (
    <div
      className="absolute left-1/2 text-2xl pointer-events-none"
      style={{
        transform: `translateX(-50%) translateY(${translateY}px) rotate(${rotation}deg)`,
      }}
    >
      📄
    </div>
  );
}


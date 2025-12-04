/**
 * Goblin sprite renderer with CSS animation
 */

import { useEffect, useState, useRef } from 'react';
import { GoblinLevel, GoblinMood } from '../lib/gameState';
import { SPRITE_MAP, SPRITE_CELL_SIZE } from '../lib/spriteMap';

interface GoblinProps {
  level: GoblinLevel;
  mood: GoblinMood;
  isEating?: boolean;
}

export function Goblin({ level, mood, isEating = false }: GoblinProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [spriteSheet, setSpriteSheet] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Load pre-processed sprite sheet (pink already removed at build time)
  useEffect(() => {
    // Use chrome.runtime.getURL for extension paths
    const spriteUrl = chrome.runtime.getURL('goblin-sprite.png');
    setSpriteSheet(spriteUrl);
  }, []);

  // Determine which animation to play
  const getAnimationKey = (): keyof typeof SPRITE_MAP => {
    if (isEating) {
      if (level === 1) return 'BABY_EAT';
      if (level === 2) return 'TEEN_LAUGH';
      return 'MONSTER_ATTACK';
    }

    if (mood === 'CORRUPT' || mood === 'DEAD') {
      return 'MONSTER_GLITCH';
    }

    if (mood === 'GREEDY') {
      return level === 1 ? 'BABY_IDLE' : 'TEEN_IDLE';
    }

    // Default idle animations
    if (level === 1) return 'BABY_IDLE';
    if (level === 2) return 'TEEN_IDLE';
    return 'MONSTER_IDLE';
  };

  const animKey = getAnimationKey();
  const sprite = SPRITE_MAP[animKey];

  // Animation loop
  useEffect(() => {
    const fps = mood === 'CORRUPT' ? 15 : 8; // Faster when corrupted
    const interval = 1000 / fps;

    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % sprite.frames);
    }, interval);

    return () => clearInterval(timer);
  }, [sprite.frames, mood]);

  // Pause animation when not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Could pause animation here if needed
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const spriteX = -(sprite.col + currentFrame) * SPRITE_CELL_SIZE;
  const spriteY = -sprite.row * SPRITE_CELL_SIZE;

  return (
    <div
      ref={containerRef}
      className="goblin-container relative"
      style={{
        width: `${SPRITE_CELL_SIZE}px`,
        height: `${SPRITE_CELL_SIZE}px`,
      }}
    >
      <div
        className="goblin-sprite"
        style={{
          width: `${SPRITE_CELL_SIZE}px`,
          height: `${SPRITE_CELL_SIZE}px`,
          backgroundImage: `url(${spriteSheet})`,
          backgroundPosition: `${spriteX}px ${spriteY}px`,
          imageRendering: 'pixelated',
          transform: mood === 'CORRUPT' ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      />
    </div>
  );
}


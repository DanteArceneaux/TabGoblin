/**
 * Goblin sprite renderer with requestAnimationFrame
 * Optimized for performance - pauses when hidden
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { GoblinLevel, GoblinMood } from '../lib/gameState';
import { SPRITE_MAP, SPRITE_CELL_SIZE } from '../lib/spriteMap';
import { GAME_CONFIG } from '../lib/config';

interface GoblinProps {
  level: GoblinLevel;
  mood: GoblinMood;
  isEating?: boolean;
}

export function Goblin({ level, mood, isEating = false }: GoblinProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [spriteSheet, setSpriteSheet] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Load pre-processed sprite sheet
  useEffect(() => {
    const spriteUrl = chrome.runtime.getURL('goblin-sprite.png');
    setSpriteSheet(spriteUrl);
  }, []);

  // Determine which animation to play
  const getAnimationKey = useCallback((): keyof typeof SPRITE_MAP => {
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

    if (level === 1) return 'BABY_IDLE';
    if (level === 2) return 'TEEN_IDLE';
    return 'MONSTER_IDLE';
  }, [level, mood, isEating]);

  const animKey = getAnimationKey();
  const sprite = SPRITE_MAP[animKey];

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    const fps = mood === 'CORRUPT' 
      ? GAME_CONFIG.animation.corruptedFps 
      : GAME_CONFIG.animation.normalFps;
    const frameInterval = 1000 / fps;

    const animate = (timestamp: number) => {
      if (!isVisibleRef.current) {
        // Panel is hidden, skip animation but keep RAF running
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;

      if (elapsed >= frameInterval) {
        lastFrameTimeRef.current = timestamp - (elapsed % frameInterval);
        setCurrentFrame((prev) => (prev + 1) % sprite.frames);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [sprite.frames, mood]);

  // Pause animation when document is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const spriteX = -(sprite.col + currentFrame) * SPRITE_CELL_SIZE;
  const spriteY = -sprite.row * SPRITE_CELL_SIZE;

  // Add shake effect when corrupted
  const shakeClass = mood === 'CORRUPT' ? 'animate-shake' : '';

  return (
    <div
      ref={containerRef}
      className={`goblin-container relative ${shakeClass}`}
      style={{
        width: `${SPRITE_CELL_SIZE}px`,
        height: `${SPRITE_CELL_SIZE}px`,
      }}
    >
      {spriteSheet && (
        <div
          className="goblin-sprite"
          style={{
            width: `${SPRITE_CELL_SIZE}px`,
            height: `${SPRITE_CELL_SIZE}px`,
            backgroundImage: `url(${spriteSheet})`,
            backgroundPosition: `${spriteX}px ${spriteY}px`,
          imageRendering: 'pixelated',
          // Use grayscale and contrast to match the gameboy screen look
          filter: mood === 'DEAD' ? 'grayscale(100%) brightness(50%)' : 'sepia(100%) hue-rotate(50deg) saturate(200%) brightness(0.8) contrast(1.2)',
          transform: mood === 'CORRUPT' ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      )}
      
      {/* Death overlay */}
      {mood === 'DEAD' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">💀</span>
        </div>
      )}
    </div>
  );
}

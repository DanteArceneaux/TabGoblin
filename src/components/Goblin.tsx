/**
 * Goblin sprite renderer with requestAnimationFrame
 * Optimized for performance - pauses when hidden
 * Supports sleep, death, and reaction states
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { GoblinLevel, GoblinMood } from '../lib/gameState';
import { SPRITE_MAP, SPRITE_CELL_SIZE } from '../lib/spriteMap';
import { GAME_CONFIG } from '../lib/config';

interface GoblinProps {
  level: GoblinLevel;
  mood: GoblinMood;
  isEating?: boolean;
  isSleeping?: boolean;
  isReviving?: boolean;
  reaction?: 'happy' | 'sad' | 'stress' | null;
}

export function Goblin({ 
  level, 
  mood, 
  isEating = false, 
  isSleeping = false,
  isReviving = false,
  reaction = null 
}: GoblinProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [spriteSheet, setSpriteSheet] = useState<string>('');
  const [sleepSprite, setSleepSprite] = useState<string>('');
  const [idleAction, setIdleAction] = useState<'bounce' | 'wave' | null>(null);
  const [zzzParticles, setZzzParticles] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Load pre-processed sprite sheet
  useEffect(() => {
    const spriteUrl = chrome.runtime.getURL('goblin-sprite.png');
    setSpriteSheet(spriteUrl);
    const sleepUrl = chrome.runtime.getURL('goblin-sleep-baby.png');
    setSleepSprite(sleepUrl);
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

  // Random idle behaviors (only when HAPPY and not sleeping)
  useEffect(() => {
    if (mood !== 'HAPPY' || isEating || isSleeping) return;

    const triggerIdleBehavior = () => {
      const random = Math.random();
      if (random < 0.3) {
        setIdleAction('bounce');
        setTimeout(() => setIdleAction(null), 1000);
      } else if (random < 0.5) {
        setIdleAction('wave');
        setTimeout(() => setIdleAction(null), 800);
      }
    };

    const interval = setInterval(triggerIdleBehavior, 5000 + Math.random() * 10000);
    return () => clearInterval(interval);
  }, [mood, isEating, isSleeping]);

  // Zzz particle spawner when sleeping
  useEffect(() => {
    if (!isSleeping) {
      setZzzParticles([]);
      return;
    }

    const spawnZzz = () => {
      const id = Date.now();
      setZzzParticles(prev => [...prev, id]);
      setTimeout(() => {
        setZzzParticles(prev => prev.filter(p => p !== id));
      }, 2000);
    };

    spawnZzz();
    const interval = setInterval(spawnZzz, 1500);
    return () => clearInterval(interval);
  }, [isSleeping]);

  const spriteX = -(sprite.col + currentFrame) * SPRITE_CELL_SIZE;
  const spriteY = -sprite.row * SPRITE_CELL_SIZE;

  // Build CSS classes based on state
  const getContainerClasses = () => {
    const classes = ['goblin-container', 'relative'];
    
    if (mood === 'CORRUPT') classes.push('animate-shake');
    if (idleAction === 'bounce') classes.push('animate-bounce');
    if (idleAction === 'wave') classes.push('animate-wiggle');
    // Only rotate for non-baby sleep (we have a dedicated baby sleep sprite)
    if (isSleeping && !(level === 1 && sleepSprite)) classes.push('sleeping');
    if (isReviving) classes.push('reviving');
    if (mood === 'DEAD' && !isReviving) classes.push('ghost');
    
    // Reactions
    if (reaction === 'happy') classes.push('happy-bounce');
    if (reaction === 'sad') classes.push('sad-squish');
    if (reaction === 'stress') classes.push('stress-shake');
    
    return classes.join(' ');
  };

  // Build filter for sprite
  const getSpriteFilter = () => {
    if (mood === 'DEAD' && !isReviving) {
      return 'grayscale(100%) brightness(50%) opacity(0.7)';
    }
    if (isSleeping) {
      return 'sepia(100%) hue-rotate(50deg) saturate(150%) brightness(0.6) contrast(1.2)';
    }
    // Game Boy green tint
    return 'sepia(100%) hue-rotate(50deg) saturate(200%) brightness(0.8) contrast(1.2)';
  };

  return (
    <div
      ref={containerRef}
      className={getContainerClasses()}
      style={{
        width: `${SPRITE_CELL_SIZE}px`,
        height: `${SPRITE_CELL_SIZE}px`,
      }}
    >
      {/* Baby sleeping uses dedicated sprite (no rotation) */}
      {isSleeping && level === 1 && sleepSprite ? (
        <img
          src={sleepSprite}
          alt="Sleeping baby goblin"
          className="goblin-sprite"
          style={{
            width: `${SPRITE_CELL_SIZE}px`,
            height: `${SPRITE_CELL_SIZE}px`,
            imageRendering: 'pixelated',
            filter: getSpriteFilter(),
            transition: 'filter 0.5s ease',
          }}
        />
      ) : spriteSheet ? (
        <div
          className="goblin-sprite"
          style={{
            width: `${SPRITE_CELL_SIZE}px`,
            height: `${SPRITE_CELL_SIZE}px`,
            backgroundImage: `url(${spriteSheet})`,
            backgroundPosition: `${spriteX}px ${spriteY}px`,
            imageRendering: 'pixelated',
            filter: getSpriteFilter(),
            transform: mood === 'CORRUPT' ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease, filter 0.5s ease',
          }}
        />
      ) : null}
      
      {/* Zzz particles when sleeping */}
      {isSleeping && zzzParticles.map((id, index) => (
        <div
          key={id}
          className="absolute text-[#9bbc0f] font-['Press_Start_2P'] text-xs zzz-particle"
          style={{
            right: -10 + (index % 2) * 5,
            top: 10,
          }}
        >
          Z
        </div>
      ))}
      
      {/* Death skull overlay */}
      {mood === 'DEAD' && !isReviving && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl opacity-80">💀</span>
        </div>
      )}

      {/* Stress sweat drop */}
      {reaction === 'stress' && (
        <div 
          className="absolute text-blue-400 text-sm sweat-drop"
          style={{ right: -5, top: 5 }}
        >
          💧
        </div>
      )}
    </div>
  );
}

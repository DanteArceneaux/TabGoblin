import { ReactNode, memo } from 'react';

interface ConsoleWrapperProps {
  children: ReactNode;
  onAButton?: () => void;
  onBButton?: () => void;
  onStart?: () => void;
  onSelect?: () => void;
  onDpadUp?: () => void;
  onDpadDown?: () => void;
  onDpadLeft?: () => void;
  onDpadRight?: () => void;
  soundEnabled: boolean;
  mood: string;
  isNight?: boolean;
  consoleVariant?: 'dmg' | 'gbc-purple' | 'gbc-teal';
}

const consoleThemes = {
  dmg: {
    bodyGradient: 'from-[#d7d7d7] via-[#cfcfcf] to-[#b9b9b9]',
    bodyShadow: 'shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.45)]',
    bezel: 'from-[#1f1f1f] to-[#2a2a2a]',
    logoText: 'text-[#3a3a3a]',
    logoAccent: 'text-[#8f0f8f]',
    buttonA: 'from-[#8f0f2f] via-[#7c0d27] to-[#5a0a1d]',
    buttonB: 'from-[#8f0f2f] via-[#7c0d27] to-[#5a0a1d]',
    dpad: 'from-gray-700 via-gray-800 to-gray-900',
    ledPosition: 'top-5 left-5',
    bezelLabel: 'text-gray-400/80',
  },
  'gbc-purple': {
    bodyGradient: 'from-[#6f3bd2] via-[#5a2aa8] to-[#2b1f5f]',
    bodyShadow: 'shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.22)]',
    bezel: 'from-[#111827] to-[#0b1220]',
    logoText: 'text-gray-200',
    logoAccent: 'text-[#67e8f9]',
    buttonA: 'from-[#f87171] via-[#ef4444] to-[#b91c1c]',
    buttonB: 'from-[#fb7185] via-[#e11d48] to-[#9f1239]',
    dpad: 'from-gray-700 via-gray-800 to-gray-900',
    ledPosition: 'top-5 left-5',
    bezelLabel: 'text-gray-300/70',
  },
  'gbc-teal': {
    bodyGradient: 'from-[#2fd3c7] via-[#1ca9a6] to-[#0e6b73]',
    bodyShadow: 'shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)]',
    bezel: 'from-[#0f172a] to-[#0b1220]',
    logoText: 'text-gray-100',
    logoAccent: 'text-[#a78bfa]',
    buttonA: 'from-[#fbbf24] via-[#f59e0b] to-[#d97706]',
    buttonB: 'from-[#60a5fa] via-[#3b82f6] to-[#1d4ed8]',
    dpad: 'from-gray-700 via-gray-800 to-gray-900',
    ledPosition: 'top-5 left-5',
    bezelLabel: 'text-gray-200/70',
  },
} as const;

function ConsoleWrapperComponent({ 
  children, 
  onAButton, 
  onBButton, 
  onStart, 
  onSelect,
  onDpadUp,
  onDpadDown,
  onDpadLeft,
  onDpadRight,
  soundEnabled,
  mood,
  isNight = false,
  consoleVariant = 'gbc-purple',
}: ConsoleWrapperProps) {
  const theme = consoleThemes[consoleVariant];
  // Power LED color based on mood
  const getLedStyle = () => {
    switch (mood) {
      case 'DEAD':
        return 'bg-gray-600';
      case 'CORRUPT':
        return 'bg-red-500 shadow-[0_0_8px_#ef4444,0_0_16px_#ef4444]';
      case 'SICK':
        return 'bg-yellow-400 shadow-[0_0_6px_#facc15]';
      default:
        return 'bg-green-400 shadow-[0_0_8px_#4ade80,0_0_12px_#4ade80]';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4 select-none">
      {/* Outer glow effect */}
      <div className="relative">
        <div className="absolute -inset-6 bg-purple-500/15 blur-3xl rounded-[4rem]" />

        {/* Console Body */}
        <div className={`relative bg-gradient-to-br ${theme.bodyGradient} rounded-b-[3rem] rounded-t-[1.25rem] p-6 w-full max-w-sm ${theme.bodyShadow} ${isNight ? 'brightness-[0.8]' : ''}`}>
          {/* Body highlight and vignette */}
          <div className="absolute inset-0 rounded-b-[3rem] rounded-t-[1.25rem] bg-gradient-to-br from-white/14 via-transparent to-black/25 pointer-events-none" />
          {/* Texture overlay */}
          <div
            className="absolute inset-0 rounded-b-[3rem] rounded-t-[1.25rem] opacity-[0.05] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            }}
          />

          {/* Power LED */}
          <div className={`absolute ${theme.ledPosition} flex items-center gap-2 z-20`}>
            <div className={`w-3 h-3 rounded-full ${getLedStyle()} transition-all duration-300 ring-2 ring-black/40`} />
            <span className="text-[8px] text-white/70 font-bold tracking-[0.12em] uppercase">Power</span>
          </div>

          {/* Screen Bezel */}
          <div
            className={`relative bg-gradient-to-b ${theme.bezel} rounded-t-[0.9rem] rounded-b-[1.8rem] p-5 pt-7 pb-7 mb-7 mt-7 shadow-[inset_0_6px_24px_rgba(0,0,0,0.65),inset_0_-4px_14px_rgba(0,0,0,0.35),0_3px_0_rgba(255,255,255,0.08)]`}
            style={{ backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(0,0,0,0.12)), linear-gradient(to bottom, var(--tw-gradient-stops))` }}
          >
            {/* Brand Logo */}
            <div className="text-center mb-3">
              <span
                className={`text-sm ${theme.logoText} font-bold tracking-[0.22em] drop-shadow-[0_1px_0_rgba(0,0,0,0.8)] uppercase`}
                style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.32em' }}
              >
                NINTABDO
              </span>
              <span className={`ml-2 text-xs font-black ${theme.logoAccent}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
                COLOR
              </span>
            </div>

            {/* Bezel glare */}
            <div
              className="pointer-events-none absolute inset-2 rounded-[1.5rem] opacity-40"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.0) 45%, rgba(0,0,0,0.25) 100%)',
              }}
            />

            {/* LCD */}
            <div className="relative bg-[#8b956d] border-[6px] border-gray-900 rounded-[6px] overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.45),inset_0_0_80px_rgba(0,0,0,0.25)] min-h-[280px] flex flex-col">
              {/* Inner bezel shadow */}
              <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none z-20" />

              {/* Pixel grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-14"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: '2px 2px',
                }}
              />

              {/* Scanline effect */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-25"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.18) 50%)',
                  backgroundSize: '100% 2px',
                }}
              />

              {/* LCD vignette/glow */}
              <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_60px_rgba(139,149,109,0.28)]" />

              {/* Screen Content */}
              <div className="relative z-0 flex-1 flex flex-col bg-[#9bbc0f]">
                {children}
              </div>
            </div>

            {/* Screen label area */}
            <div className="flex justify-between items-center mt-3 px-1">
              <div className={`text-[7px] ${theme.bezelLabel} tracking-[0.2em]`}>DOT MATRIX WITH STEREO SOUND</div>
            </div>
          </div>

          {/* Controls Area */}
          <div className="flex justify-between items-end px-3 pb-3 relative z-10">
            {/* D-Pad */}
          <div className="w-[78px] h-[78px] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-16 h-16 bg-gradient-to-b ${theme.dpad} rounded-[6px] shadow-[0_5px_0_#111827,inset_0_1px_0_rgba(255,255,255,0.08)]`} />
                <div className={`absolute w-6 h-16 bg-gradient-to-b ${theme.dpad} rounded-[6px] shadow-[0_4px_0_#111827,inset_0_1px_0_rgba(255,255,255,0.08)]`} />
                <div className={`absolute w-16 h-6 bg-gradient-to-b ${theme.dpad} rounded-[6px] shadow-[0_4px_0_#111827,inset_0_1px_0_rgba(255,255,255,0.08)]`} />
                <div className="absolute w-5 h-5 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
              </div>
              <button
                onClick={onDpadUp}
                aria-label="D-pad Up"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-7 bg-transparent hover:bg-white/10 active:bg-white/25 active:translate-y-[1px] rounded-t-[6px] z-10"
              />
              <button
                onClick={onDpadDown}
                aria-label="D-pad Down"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-7 bg-transparent hover:bg-white/10 active:bg-white/25 active:-translate-y-[1px] rounded-b-[6px] z-10"
              />
              <button
                onClick={onDpadLeft}
                aria-label="D-pad Left"
              className="absolute top-1/2 left-0 -translate-y-1/2 w-7 h-7 bg-transparent hover:bg-white/10 active:bg-white/25 active:translate-x-[1px] rounded-l-[6px] z-10"
              />
              <button
                onClick={onDpadRight}
                aria-label="D-pad Right"
              className="absolute top-1/2 right-0 -translate-y-1/2 w-7 h-7 bg-transparent hover:bg-white/10 active:bg-white/25 active:-translate-x-[1px] rounded-r-[6px] z-10"
              />
            </div>

            {/* Start/Select Buttons */}
            <div className="flex gap-3 mb-3">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={onSelect}
                  className="w-12 h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -rotate-[15deg] shadow-[0_2px_0_#374151,inset_0_1px_0_rgba(255,255,255,0.15)] active:shadow-none active:translate-y-[1px] transition-all hover:from-gray-500"
                  aria-label="Select"
                />
                <span className="text-[7px] text-white/60 font-bold tracking-wider mt-1">SELECT</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={onStart}
                  className="w-12 h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -rotate-[15deg] shadow-[0_2px_0_#374151,inset_0_1px_0_rgba(255,255,255,0.15)] active:shadow-none active:translate-y-[1px] transition-all hover:from-gray-500"
                  aria-label="Start"
                />
                <span className="text-[7px] text-white/60 font-bold tracking-wider mt-1">START</span>
              </div>
            </div>

            {/* A/B Buttons */}
            <div className="flex gap-4 items-end">
              <div className="flex flex-col items-center mb-2">
                <button
                  onClick={onBButton}
                  className={`w-11 h-11 rounded-full transition-all flex items-center justify-center
                    bg-gradient-to-b ${theme.buttonB}
                    shadow-[0_5px_0_#111827,0_8px_14px_rgba(0,0,0,0.45),inset_0_2px_0_rgba(255,255,255,0.25)]
                    active:shadow-[0_1px_0_#111827,inset_0_2px_0_rgba(255,255,255,0.25)]
                    active:translate-y-[2px] active:rotate-[-10deg]
                    hover:brightness-110
                    -rotate-[12deg]
                    ${!soundEnabled ? 'opacity-60' : ''}
                  `}
                  aria-label="B Button - Toggle Sound"
                >
                  <span className="text-rose-950 font-black text-lg drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]">B</span>
                </button>
              </div>

              <div className="flex flex-col items-center -mb-1">
                <button
                  onClick={onAButton}
                  className={`w-11 h-11 rounded-full transition-all flex items-center justify-center
                    bg-gradient-to-b ${theme.buttonA}
                    shadow-[0_5px_0_#111827,0_8px_14px_rgba(0,0,0,0.45),inset_0_2px_0_rgba(255,255,255,0.25)]
                    active:shadow-[0_1px_0_#111827,inset_0_2px_0_rgba(255,255,255,0.25)]
                    active:translate-y-[2px] active:rotate-[-10deg]
                    hover:brightness-110
                    -rotate-[12deg]
                  `}
                  aria-label="A Button - Interact"
                >
                  <span className="text-rose-950 font-black text-lg drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]">A</span>
                </button>
              </div>
            </div>
          </div>

          {/* Speaker Grille */}
          <div className="absolute bottom-4 right-5 flex gap-[3px] transform -rotate-[34deg]">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-[3px] h-10 bg-gradient-to-b from-black via-gray-900 to-gray-700 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
              />
            ))}
          </div>

          {/* Bottom edge detail */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}

export const ConsoleWrapper = memo(ConsoleWrapperComponent);

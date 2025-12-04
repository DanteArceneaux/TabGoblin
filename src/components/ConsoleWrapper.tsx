import { ReactNode } from 'react';

interface ConsoleWrapperProps {
  children: ReactNode;
  onAButton?: () => void;
  onBButton?: () => void;
  onStart?: () => void;
  onSelect?: () => void;
  soundEnabled: boolean;
  mood: string;
}

export function ConsoleWrapper({ 
  children, 
  onAButton, 
  onBButton, 
  onStart, 
  onSelect,
  soundEnabled,
  mood
}: ConsoleWrapperProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 select-none">
      
      {/* Outer glow effect */}
      <div className="relative">
        <div className="absolute -inset-4 bg-purple-500/20 blur-2xl rounded-[4rem]" />
        
        {/* The Console Body - Plastic Material with Gradient */}
        <div className="relative bg-gradient-to-br from-purple-400 via-purple-600 to-purple-900 rounded-b-[3rem] rounded-t-[1.5rem] p-6 w-full max-w-sm shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)]">
          
          {/* Plastic highlight edge (top-left light source) */}
          <div className="absolute inset-0 rounded-b-[3rem] rounded-t-[1.5rem] bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none" />
          
          {/* Texture overlay for plastic feel */}
          <div className="absolute inset-0 rounded-b-[3rem] rounded-t-[1.5rem] opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
          
          {/* Power LED */}
          <div className="absolute top-5 left-5 flex items-center gap-2 z-20">
            <div className={`w-3 h-3 rounded-full ${getLedStyle()} transition-all duration-300`} />
            <span className="text-[8px] text-purple-200/60 font-bold tracking-[0.15em] uppercase">Power</span>
          </div>

          {/* Screen Bezel - Deep Recessed Look */}
          <div className="relative bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-lg rounded-b-[2rem] p-6 pt-8 pb-8 mb-6 mt-6 shadow-[inset_0_4px_20px_rgba(0,0,0,0.7),inset_0_-2px_10px_rgba(0,0,0,0.3),0_2px_0_rgba(255,255,255,0.05)]">
            
            {/* Brand Logo */}
            <div className="text-center mb-3">
              <span className="text-sm text-gray-400/80 font-bold italic tracking-[0.25em] drop-shadow-[0_1px_0_rgba(0,0,0,0.8)]" style={{ fontFamily: 'system-ui, sans-serif' }}>
                NINTABDO
              </span>
            </div>
            
            {/* The LCD Screen - Authentic Game Boy Green */}
            <div className="relative bg-[#8b956d] border-[6px] border-gray-800 rounded-sm overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.4),inset_0_0_80px_rgba(0,0,0,0.2)] min-h-[280px] flex flex-col">
              
              {/* Inner bezel shadow */}
              <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none z-20" />
              
              {/* Pixel grid overlay */}
              <div 
                className="absolute inset-0 pointer-events-none z-10 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '2px 2px'
                }}
              />
              
              {/* Scanline effect */}
              <div 
                className="absolute inset-0 pointer-events-none z-10 opacity-30"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.15) 50%)',
                  backgroundSize: '100% 2px'
                }}
              />
              
              {/* LCD vignette/glow */}
              <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_60px_rgba(139,149,109,0.3)]" />
              
              {/* Screen Content */}
              <div className="relative z-0 flex-1 flex flex-col bg-[#9bbc0f]">
                {children}
              </div>
            </div>
            
            {/* Screen label area */}
            <div className="flex justify-between items-center mt-3 px-1">
              <div className="text-[6px] text-gray-500/60 tracking-wider">DOT MATRIX WITH STEREO SOUND</div>
            </div>
          </div>

          {/* Controls Area */}
          <div className="flex justify-between items-end px-2 pb-2 relative z-10">
            
            {/* D-Pad */}
            <div className="w-20 h-20 relative">
              {/* Vertical bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-full">
                <div className="w-full h-full bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 rounded-sm shadow-[0_3px_0_#1f2937,inset_0_1px_0_rgba(255,255,255,0.1)]" />
              </div>
              {/* Horizontal bar */}
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-7">
                <div className="w-full h-full bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 rounded-sm shadow-[0_3px_0_#1f2937,inset_0_1px_0_rgba(255,255,255,0.1)]" />
              </div>
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-radial from-gray-600 to-gray-800 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
            </div>

            {/* Start/Select Buttons */}
            <div className="flex gap-4 mb-2">
              <div className="flex flex-col items-center gap-1">
                <button 
                  onClick={onSelect}
                  className="w-10 h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -rotate-[25deg] shadow-[0_2px_0_#374151,inset_0_1px_0_rgba(255,255,255,0.15)] active:shadow-none active:translate-y-[2px] transition-all hover:from-gray-500"
                  aria-label="Select"
                />
                <span className="text-[7px] text-purple-200/50 font-bold tracking-wider mt-1">SELECT</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button 
                  onClick={onStart}
                  className="w-10 h-3 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full transform -rotate-[25deg] shadow-[0_2px_0_#374151,inset_0_1px_0_rgba(255,255,255,0.15)] active:shadow-none active:translate-y-[2px] transition-all hover:from-gray-500"
                  aria-label="Start"
                />
                <span className="text-[7px] text-purple-200/50 font-bold tracking-wider mt-1">START</span>
              </div>
            </div>

            {/* A/B Buttons */}
            <div className="flex gap-3 items-end">
              {/* B Button (lower) */}
              <div className="flex flex-col items-center mb-2">
                <button 
                  onClick={onBButton}
                  className={`w-11 h-11 rounded-full transition-all flex items-center justify-center
                    bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700
                    shadow-[0_5px_0_#881337,0_6px_10px_rgba(0,0,0,0.4),inset_0_2px_0_rgba(255,255,255,0.25)]
                    active:shadow-[0_1px_0_#881337,inset_0_2px_0_rgba(255,255,255,0.25)]
                    active:translate-y-1
                    hover:from-rose-400
                    ${!soundEnabled ? 'opacity-60' : ''}
                  `}
                  aria-label="B Button - Toggle Sound"
                >
                  <span className="text-rose-900 font-black text-lg drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">B</span>
                </button>
              </div>
              
              {/* A Button (higher) */}
              <div className="flex flex-col items-center -mb-1">
                <button 
                  onClick={onAButton}
                  className="w-11 h-11 rounded-full transition-all flex items-center justify-center
                    bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700
                    shadow-[0_5px_0_#881337,0_6px_10px_rgba(0,0,0,0.4),inset_0_2px_0_rgba(255,255,255,0.25)]
                    active:shadow-[0_1px_0_#881337,inset_0_2px_0_rgba(255,255,255,0.25)]
                    active:translate-y-1
                    hover:from-rose-400
                  "
                  aria-label="A Button - Interact"
                >
                  <span className="text-rose-900 font-black text-lg drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">A</span>
                </button>
              </div>
            </div>
          </div>

          {/* Speaker Grille */}
          <div className="absolute bottom-8 right-6 flex gap-[3px] transform -rotate-[30deg]">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="w-[3px] h-10 bg-gradient-to-b from-purple-900 via-purple-950 to-black rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" 
              />
            ))}
          </div>
          
          {/* Bottom edge detail */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-purple-300/20 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}

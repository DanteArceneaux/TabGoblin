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
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 select-none">
      {/* The Console Body */}
      <div className="relative bg-indigo-600 rounded-b-[3rem] rounded-t-[1rem] p-6 shadow-2xl w-full max-w-sm border-b-8 border-indigo-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Power LED */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${mood === 'DEAD' ? 'bg-red-500 animate-pulse' : 'bg-green-400 shadow-[0_0_10px_#4ade80]'}`} />
          <span className="text-[10px] text-indigo-200 font-bold tracking-wider opacity-50">POWER</span>
        </div>

        {/* Screen Bezel */}
        <div className="bg-gray-700 rounded-t-lg rounded-b-[2rem] p-6 mb-8 shadow-inner relative">
          <div className="text-center mb-1">
            <span className="text-xs text-gray-400 font-bold italic tracking-widest">NINTABDO</span>
          </div>
          
          {/* The LCD Screen */}
          <div className="bg-[#9bbc0f] border-4 border-gray-600 rounded overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] relative min-h-[300px] flex flex-col">
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_2px,3px_100%]" />
            
            {/* Screen Content */}
            <div className="relative z-0 flex-1 flex flex-col">
              {children}
            </div>
          </div>
        </div>

        {/* Controls Area */}
        <div className="flex justify-between items-end px-2">
          {/* D-Pad */}
          <div className="w-24 h-24 relative">
            <div className="absolute top-0 left-1/3 w-1/3 h-full bg-gray-800 rounded shadow-md" />
            <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gray-800 rounded shadow-md" />
            <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-gray-700 rounded-full radial-gradient(circle at center, #333 0%, #222 100%)" />
          </div>

          {/* Start/Select */}
          <div className="flex gap-3 mb-4 -ml-4">
            <div className="flex flex-col items-center gap-1">
              <button 
                onClick={onSelect}
                className="w-12 h-3 bg-gray-800 rounded-full transform -rotate-12 shadow-md active:translate-y-0.5 active:shadow-none transition-transform"
              />
              <span className="text-[10px] text-indigo-200 font-bold tracking-wider">SELECT</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <button 
                onClick={onStart}
                className="w-12 h-3 bg-gray-800 rounded-full transform -rotate-12 shadow-md active:translate-y-0.5 active:shadow-none transition-transform"
              />
              <span className="text-[10px] text-indigo-200 font-bold tracking-wider">START</span>
            </div>
          </div>

          {/* A/B Buttons */}
          <div className="flex gap-4 relative top-2">
            <div className="flex flex-col items-center gap-1 relative top-4">
              <button 
                onClick={onBButton}
                className={`w-10 h-10 rounded-full shadow-[0_4px_0_#9f1239] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center ${
                  soundEnabled ? 'bg-rose-600' : 'bg-rose-800'
                }`}
              >
                <span className="text-rose-900 font-bold text-sm">B</span>
              </button>
            </div>
            <div className="flex flex-col items-center gap-1 -mt-2">
              <button 
                onClick={onAButton}
                className="w-10 h-10 bg-rose-600 rounded-full shadow-[0_4px_0_#9f1239] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center"
              >
                <span className="text-rose-900 font-bold text-sm">A</span>
              </button>
            </div>
          </div>
        </div>

        {/* Speaker Grille */}
        <div className="absolute bottom-6 right-8 flex gap-1 transform -rotate-12 opacity-50">
          <div className="w-1 h-8 bg-indigo-900 rounded-full" />
          <div className="w-1 h-8 bg-indigo-900 rounded-full" />
          <div className="w-1 h-8 bg-indigo-900 rounded-full" />
          <div className="w-1 h-8 bg-indigo-900 rounded-full" />
        </div>
      </div>
    </div>
  );
}


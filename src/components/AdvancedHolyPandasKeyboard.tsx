import React, { useState, useRef, useEffect } from 'react';
import { HOLY_PANDAS_SOUNDS, KEY_SOUND_MAP } from './HolyPandasSounds';

interface AdvancedHolyPandasKeyboardProps {
  className?: string;
}

export function AdvancedHolyPandasKeyboard({ className = '' }: AdvancedHolyPandasKeyboardProps) {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlayingKey, setCurrentlyPlayingKey] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentGenericIndex = useRef(0);

  const initializeAudio = async () => {
    try {
      // Create AudioContext for Shopify mobile app
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      setAudioInitialized(true);
      
      // Play a quick test sound to verify everything works
      await playKeyboardSound('generic');
      
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  };

  const playKeyboardSound = async (key: string) => {
    if (!audioInitialized || !audioContextRef.current) return;
    
    setIsPlaying(true);
    setCurrentlyPlayingKey(key);
    
    try {
      // Ensure AudioContext is active
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      let soundData: string;
      
      // Determine which sound to play based on the key
      if (key === ' ' || key === 'Space') {
        soundData = HOLY_PANDAS_SOUNDS.space;
      } else if (key === 'Enter') {
        soundData = HOLY_PANDAS_SOUNDS.enter;
      } else if (key === 'Backspace') {
        soundData = HOLY_PANDAS_SOUNDS.backspace;
      } else {
        // Use generic sounds and rotate through them
        soundData = HOLY_PANDAS_SOUNDS.generic[currentGenericIndex.current % HOLY_PANDAS_SOUNDS.generic.length];
        currentGenericIndex.current++;
      }

      // Create and play audio from base64 data
      const audio = new Audio(soundData);
      audio.volume = 0.8;
      
      await audio.play();
      
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentlyPlayingKey(null);
      }, 200);
      
    } catch (error) {
      console.warn('Sound play failed:', error);
      setIsPlaying(false);
      setCurrentlyPlayingKey(null);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (!audioInitialized) return;
    
    const { key, code } = event;
    
    if (code === 'Space') {
      event.preventDefault();
      playKeyboardSound('Space');
    } else if (code === 'Enter') {
      playKeyboardSound('Enter');
    } else if (code === 'Backspace') {
      playKeyboardSound('Backspace');
    } else if (code.startsWith('Key') || code.startsWith('Digit')) {
      playKeyboardSound('generic');
    }
  };

  // Keyboard layout for visual testing
  const keyRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Enter'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  return (
    <div className={`p-6 bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl ${className}`}>
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">🎵 Advanced Holy Pandas Sounds</h2>
        <p className="text-slate-400 text-sm">
          Full Holy Pandas collection: {HOLY_PANDAS_SOUNDS.generic.length} generic variants + specific keys
        </p>
        <p className="text-slate-500 text-xs mt-1">
          BACKSPACE • ENTER • SPACE • GENERIC_R0-R4 (all embedded as base64)
        </p>
      </div>

      {/* Initialize Button */}
      {!audioInitialized ? (
        <button
          onClick={initializeAudio}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg mb-6 transition-colors duration-200"
        >
          🔊 Initialize Advanced Keyboard Sounds
        </button>
      ) : (
        <>
          {/* Test Buttons for Each Sound Type */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => playKeyboardSound('generic')}
              disabled={isPlaying}
              className={`py-3 px-4 rounded-lg font-medium transition-all duration-150 ${
                currentlyPlayingKey === 'generic'
                  ? 'bg-blue-700 transform scale-95' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white text-sm`}
            >
              🎵 Generic ({currentGenericIndex.current % HOLY_PANDAS_SOUNDS.generic.length + 1}/5)
            </button>
            
            <button
              onClick={() => playKeyboardSound('Space')}
              disabled={isPlaying}
              className={`py-3 px-4 rounded-lg font-medium transition-all duration-150 ${
                currentlyPlayingKey === 'Space'
                  ? 'bg-purple-700 transform scale-95' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white text-sm`}
            >
              🚀 Space Bar
            </button>
            
            <button
              onClick={() => playKeyboardSound('Enter')}
              disabled={isPlaying}
              className={`py-3 px-4 rounded-lg font-medium transition-all duration-150 ${
                currentlyPlayingKey === 'Enter'
                  ? 'bg-emerald-700 transform scale-95' 
                  : 'bg-emerald-600 hover:bg-emerald-700'
              } text-white text-sm`}
            >
              ⏎ Enter Key
            </button>
            
            <button
              onClick={() => playKeyboardSound('Backspace')}
              disabled={isPlaying}
              className={`py-3 px-4 rounded-lg font-medium transition-all duration-150 ${
                currentlyPlayingKey === 'Backspace'
                  ? 'bg-red-700 transform scale-95' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white text-sm`}
            >
              ⌫ Backspace
            </button>
          </div>

          {/* Virtual Keyboard */}
          <div 
            className="bg-slate-800/30 p-4 rounded-xl border border-slate-700 focus:outline-none" 
            tabIndex={0}
            onKeyDown={handleKeyPress}
          >
            <p className="text-slate-400 text-sm text-center mb-4">
              Click keys or use your physical keyboard - Each key type has its own unique sound!
            </p>
            
            <div className="space-y-2">
              {keyRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center space-x-1">
                  {row.map((key) => (
                    <button
                      key={key}
                      onClick={() => playKeyboardSound(key)}
                      className={`${
                        key === 'Backspace' ? 'w-16' : key === 'Enter' ? 'w-14' : 'w-10'
                      } h-10 rounded-lg text-white text-xs font-medium transition-all duration-150 border border-slate-600 ${
                        currentlyPlayingKey === key || (currentlyPlayingKey === 'generic' && !['Space', 'Enter', 'Backspace'].includes(key))
                          ? 'bg-blue-600 transform scale-95' 
                          : key === 'Backspace' 
                            ? 'bg-red-700 hover:bg-red-600'
                            : key === 'Enter'
                              ? 'bg-emerald-700 hover:bg-emerald-600'
                              : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {key === 'Backspace' ? '⌫' : key === 'Enter' ? '⏎' : key}
                    </button>
                  ))}
                </div>
              ))}
              
              {/* Space bar */}
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => playKeyboardSound('Space')}
                  className={`w-48 h-10 bg-purple-700 hover:bg-purple-600 border border-slate-600 rounded-lg text-white text-xs font-medium transition-all duration-150 ${
                    currentlyPlayingKey === 'Space' ? 'bg-purple-600 transform scale-95' : ''
                  }`}
                >
                  Space Bar
                </button>
              </div>
            </div>
          </div>

          {/* Status & Sound Info */}
          <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-center">
              <h3 className="text-white font-medium mb-2">✅ Full Holy Pandas Collection Loaded!</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400">Generic Sounds:</p>
                  <p className="text-white">{HOLY_PANDAS_SOUNDS.generic.length} variants</p>
                </div>
                <div>
                  <p className="text-slate-400">Special Keys:</p>
                  <p className="text-white">Space, Enter, Backspace</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                All sounds embedded as base64 • Works in Shopify WebViews • No external files
              </p>
              {isPlaying && (
                <p className="text-blue-400 text-xs mt-2 animate-pulse">
                  🎵 Playing: {currentlyPlayingKey === 'generic' ? `Generic R${currentGenericIndex.current % HOLY_PANDAS_SOUNDS.generic.length}` : currentlyPlayingKey}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

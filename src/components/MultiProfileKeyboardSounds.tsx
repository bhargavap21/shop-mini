import React, { useState, useRef, useEffect } from 'react';
import { HOLY_PANDAS_SOUNDS, KEY_SOUND_MAP } from './HolyPandasSounds';
import { BANANA_SPLIT_SOUNDS, BANANA_SPLIT_PROFILE } from './BananaSplitSounds';

// Sound profiles configuration
const SOUND_PROFILES = {
  'holy-pandas': {
    id: 'holy-pandas',
    name: 'Holy Pandas',
    description: 'Tactile switches with distinct "thock" sound',
    sounds: HOLY_PANDAS_SOUNDS,
    hasSpecialKeys: true, // Has space, enter, backspace
    color: 'purple'
  },
  'banana-split': {
    id: 'banana-split',
    name: 'Banana Split (Lubed)',
    description: 'Smooth, deep tactile switches',
    sounds: BANANA_SPLIT_SOUNDS,
    hasSpecialKeys: false, // Only generic sounds
    color: 'yellow'
  }
};

interface MultiProfileKeyboardSoundsProps {
  className?: string;
}

export function MultiProfileKeyboardSounds({ className = '' }: MultiProfileKeyboardSoundsProps) {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlayingKey, setCurrentlyPlayingKey] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<keyof typeof SOUND_PROFILES>('holy-pandas');
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentGenericIndex = useRef(0);

  const currentProfile = SOUND_PROFILES[selectedProfile];

  const initializeAudio = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      setAudioInitialized(true);
      
      // Play a quick test sound
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
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      let soundData: string;
      const profile = currentProfile.sounds;
      
      // For profiles with special keys (Holy Pandas)
      if (currentProfile.hasSpecialKeys && selectedProfile === 'holy-pandas') {
        if (key === ' ' || key === 'Space') {
          soundData = profile.space || profile.generic[0];
        } else if (key === 'Enter') {
          soundData = profile.enter || profile.generic[0];
        } else if (key === 'Backspace') {
          soundData = profile.backspace || profile.generic[0];
        } else {
          soundData = profile.generic[currentGenericIndex.current % profile.generic.length];
          currentGenericIndex.current++;
        }
      } else {
        // For profiles with only generic sounds (Banana Split) or fallback
        soundData = profile.generic[currentGenericIndex.current % profile.generic.length];
        currentGenericIndex.current++;
      }

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

  const handleProfileChange = (profileId: keyof typeof SOUND_PROFILES) => {
    setSelectedProfile(profileId);
    currentGenericIndex.current = 0; // Reset generic sound index
  };

  // Keyboard layout
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
        <h2 className="text-2xl font-bold text-white mb-2">🎹 Multi-Profile Keyboard Sounds</h2>
        <p className="text-slate-400 text-sm">
          Switch between different mechanical keyboard sound profiles
        </p>
      </div>

      {/* Profile Selector */}
      {audioInitialized && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Sound Profile
          </label>
          <div className="relative">
            <select
              value={selectedProfile}
              onChange={(e) => handleProfileChange(e.target.value as keyof typeof SOUND_PROFILES)}
              className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-lg text-white font-medium focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
            >
              {Object.entries(SOUND_PROFILES).map(([id, profile]) => (
                <option key={id} value={id}>
                  {profile.name} ({profile.sounds.generic.length} sounds{profile.hasSpecialKeys ? ' + special keys' : ''})
                </option>
              ))}
            </select>
            {/* Dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Profile Description */}
          <div className={`mt-4 p-4 rounded-lg border-2 ${
            selectedProfile === 'holy-pandas' 
              ? 'border-purple-500/30 bg-purple-900/10'
              : 'border-yellow-500/30 bg-yellow-900/10'
          }`}>
            <h3 className="text-white font-semibold mb-2">
              {currentProfile.name}
            </h3>
            <p className="text-slate-300 text-sm mb-3">
              {currentProfile.description}
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">
                🎵 {currentProfile.sounds.generic.length} generic sounds
              </span>
              {currentProfile.hasSpecialKeys && (
                <span className="text-purple-400 bg-purple-900/20 px-2 py-1 rounded">
                  + Special keys (Space, Enter, Backspace)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Initialize Button */}
      {!audioInitialized ? (
        <button
          onClick={initializeAudio}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg mb-6 transition-colors duration-200"
        >
          🔊 Initialize Multi-Profile Sounds
        </button>
      ) : (
        <>
          {/* Test Buttons */}
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
              🎵 Test Sound ({currentGenericIndex.current % currentProfile.sounds.generic.length + 1}/{currentProfile.sounds.generic.length})
            </button>
            
            {currentProfile.hasSpecialKeys && (
              <>
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
              </>
            )}
          </div>

          {/* Virtual Keyboard */}
          <div 
            className="bg-slate-800/30 p-4 rounded-xl border border-slate-700 focus:outline-none" 
            tabIndex={0}
            onKeyDown={handleKeyPress}
          >
            <p className="text-slate-400 text-sm text-center mb-4">
              Click keys or use your physical keyboard
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
                          : currentProfile.hasSpecialKeys && key === 'Backspace' 
                            ? 'bg-red-700 hover:bg-red-600'
                            : currentProfile.hasSpecialKeys && key === 'Enter'
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
                  className={`w-48 h-10 ${
                    currentProfile.hasSpecialKeys 
                      ? 'bg-purple-700 hover:bg-purple-600' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  } border border-slate-600 rounded-lg text-white text-xs font-medium transition-all duration-150 ${
                    currentlyPlayingKey === 'Space' ? 'bg-purple-600 transform scale-95' : ''
                  }`}
                >
                  Space Bar
                </button>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-center">
              <h3 className="text-white font-medium mb-2">
                ✅ Profile: {currentProfile.name}
              </h3>
              <p className="text-slate-400 text-xs">
                {currentProfile.sounds.generic.length} generic sounds
                {currentProfile.hasSpecialKeys && ' + special key sounds'}
              </p>
              <p className="text-slate-500 text-xs mt-2">
                All sounds embedded as base64 • Works in Shopify WebViews
              </p>
              {isPlaying && (
                <p className="text-blue-400 text-xs mt-2 animate-pulse">
                  🎵 Playing: {currentlyPlayingKey === 'generic' 
                    ? `Sound ${(currentGenericIndex.current % currentProfile.sounds.generic.length) || currentProfile.sounds.generic.length}` 
                    : currentlyPlayingKey}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

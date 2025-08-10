import React, { useState, useRef, useEffect } from 'react';
import { HOLY_PANDAS_SOUNDS } from './HolyPandasSounds';
import { BANANA_SPLIT_SOUNDS } from './BananaSplitSounds';
import { SteelSeriesSounds } from './SteelSeriesSounds';
import { TealiosSounds } from './TealiosSounds';
import { MX_SPEED_SILVER_SOUNDS } from './MxSpeedSilverSounds';
import { CHERRY_MX_BLACK_EXTRACTED_SOUNDS } from './CherryMxBlackExtractedSounds';
import { CHERRYMX_BLUE_PBT_SOUNDS } from './CherrymxBluePbtSounds';
import { CHERRYMX_BROWN_PBT_SOUNDS } from './CherrymxBrownPbtSounds';
import { CHERRYMX_RED_PBT_SOUNDS } from './CherrymxRedPbtSounds';
import { TOPRE_PURPLE_HYBRID_PBT_SOUNDS } from './ToprePurpleHybridPbtSounds';

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
  },
  'steelseries': {
    id: 'steelseries',
    name: 'SteelSeries Apex Pro TKL',
    description: 'Mechanical gaming switches with crisp actuation',
    sounds: SteelSeriesSounds,
    hasSpecialKeys: true, // Has space, enter, backspace
    color: 'blue'
  },
  'tealios': {
    id: 'tealios',
    name: 'Tealios V2 on PBT',
    description: 'Premium linear switches with smooth keystrokes',
    sounds: TealiosSounds,
    hasSpecialKeys: true, // Has space, enter, backspace, shift, ctrl, caps, tab
    color: 'teal'
  },
  'mx-speed-silver': {
    id: 'mx-speed-silver',
    name: 'MX Speed Silver',
    description: 'Ultra-fast linear gaming switches with 1.2mm actuation',
    sounds: MX_SPEED_SILVER_SOUNDS,
    hasSpecialKeys: false, // Only generic sounds - evenly distributed
    color: 'gray'
  },
  'cherry-mx-black': {
    id: 'cherry-mx-black',
    name: 'Cherry MX Black PBT',
    description: 'Heavy linear switches with consistent actuation (Extracted)',
    sounds: CHERRY_MX_BLACK_EXTRACTED_SOUNDS,
    hasSpecialKeys: false, // Uses generic distribution like other multi-file profiles
    color: 'black'
  },
  'cherrymx-blue-pbt': {
    id: 'cherrymx-blue-pbt',
    name: 'Cherry MX Blue PBT',
    description: 'Classic clicky switches with tactile bump and audible click',
    sounds: CHERRYMX_BLUE_PBT_SOUNDS,
    hasSpecialKeys: false, // Uses generic distribution
    color: 'blue'
  },
  'cherrymx-brown-pbt': {
    id: 'cherrymx-brown-pbt',
    name: 'Cherry MX Brown PBT',
    description: 'Tactile switches with bump but no click sound',
    sounds: CHERRYMX_BROWN_PBT_SOUNDS,
    hasSpecialKeys: false, // Uses generic distribution
    color: 'amber'
  },
  'cherrymx-red-pbt': {
    id: 'cherrymx-red-pbt',
    name: 'Cherry MX Red PBT',
    description: 'Linear switches with smooth keystroke and no tactile bump',
    sounds: CHERRYMX_RED_PBT_SOUNDS,
    hasSpecialKeys: false, // Uses generic distribution
    color: 'red'
  },
  'topre-purple-hybrid-pbt': {
    id: 'topre-purple-hybrid-pbt',
    name: 'Topre Purple Hybrid PBT',
    description: 'Premium electro-capacitive switches with unique thock sound',
    sounds: TOPRE_PURPLE_HYBRID_PBT_SOUNDS,
    hasSpecialKeys: false, // Uses generic distribution
    color: 'purple'
  }
};

interface MultiProfileKeyboardSoundsProps {
  className?: string;
}

export function MultiProfileKeyboardSounds({ className = '' }: MultiProfileKeyboardSoundsProps) {
  // Test console connection
  console.log('🎹 MultiProfileKeyboardSounds component loaded!');
  
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlayingKey, setCurrentlyPlayingKey] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<keyof typeof SOUND_PROFILES>('holy-pandas');
  const [testText, setTestText] = useState('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentGenericIndex = useRef(0);
  const keyToSoundMap = useRef<Map<string, number>>(new Map());
  const keyboardRef = useRef<HTMLDivElement>(null);


  const currentProfile = SOUND_PROFILES[selectedProfile];



  // Auto-focus the keyboard div when audio is initialized
  useEffect(() => {
    if (audioInitialized && keyboardRef.current) {
      console.log('🎯 Auto-focusing keyboard area');
      keyboardRef.current.focus();
    }
  }, [audioInitialized]);

  // Add global keyboard event listener - always active, but only responds when audio is initialized
  useEffect(() => {
    const handleGlobalKeyPress = (event: KeyboardEvent) => {
      console.log('🌍 Global key detected:', { key: event.key, code: event.code, audioInitialized });
      
      if (!audioInitialized) {
        console.log('❌ Audio not initialized, ignoring key');
        return;
      }
      
      const { key, code } = event;
      
      if (code === 'Space') {
        event.preventDefault();
        playKeyboardSound('Space');
      } else if (code === 'Enter') {
        playKeyboardSound('Enter');
      } else if (code === 'Backspace') {
        playKeyboardSound('Backspace');
      } else if (code === 'Tab') {
        event.preventDefault();
        playKeyboardSound('Tab');
      } else if (code === 'ShiftLeft' || code === 'ShiftRight') {
        playKeyboardSound('Shift');
      } else if (code === 'ControlLeft' || code === 'ControlRight') {
        playKeyboardSound('Ctrl');
      } else if (code === 'CapsLock') {
        playKeyboardSound('Caps');
      } else if (code.startsWith('Key') || code.startsWith('Digit')) {
        playKeyboardSound(key.toUpperCase());
      }
    };

    console.log('🎹 Adding global keyboard listener (always active)');
    document.addEventListener('keydown', handleGlobalKeyPress);

    return () => {
      console.log('🎹 Removing global keyboard listener (component unmount)');
      document.removeEventListener('keydown', handleGlobalKeyPress);
    };
  }, []); // Empty dependency array - listener stays active for component lifetime

  // Function to get consistent sound index for a key
  const getSoundIndexForKey = (key: string): number => {
    // Check if we already have a mapping for this key
    if (keyToSoundMap.current.has(key)) {
      return keyToSoundMap.current.get(key)!;
    }



    // Create a consistent mapping based on key character for ALL keys
    const availableSounds = (currentProfile.sounds as any).generic?.length || 1;
    let soundIndex = 0;

    if (key.length === 1) {
      // For single character keys, use character code
      soundIndex = key.charCodeAt(0) % availableSounds;
    } else {
      // For longer keys like "Backspace", "Enter", "Space", use a hash of the key name
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = ((hash << 5) - hash + key.charCodeAt(i)) & 0xffffffff;
      }
      soundIndex = Math.abs(hash) % availableSounds;
    }

    // Store the mapping for consistency
    keyToSoundMap.current.set(key, soundIndex);
    return soundIndex;
  };

  const initializeAudio = async () => {
    console.log('🔊 Initialize button clicked!');
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
      
      // Handle special keys for profiles that have them (non-sprite profiles only)
      if (currentProfile.hasSpecialKeys && (selectedProfile === 'holy-pandas' || selectedProfile === 'steelseries' || selectedProfile === 'tealios')) {
        if (key === ' ' || key === 'Space') {
          soundData = (profile as any).space || (profile as any).generic[getSoundIndexForKey(key)];
        } else if (key === 'Enter') {
          soundData = (profile as any).enter || (profile as any).generic[getSoundIndexForKey(key)];
        } else if (key === 'Backspace') {
          soundData = (profile as any).backspace || (profile as any).generic[getSoundIndexForKey(key)];
        } else if (selectedProfile === 'tealios') {
          // Tealios has additional special keys
          if (key === 'Tab') {
            soundData = (profile as any).tab || (profile as any).generic[getSoundIndexForKey(key)];
          } else if (key === 'Shift') {
            soundData = (profile as any).shift || (profile as any).generic[getSoundIndexForKey(key)];
          } else if (key === 'Control' || key === 'Ctrl') {
            soundData = (profile as any).ctrl || (profile as any).generic[getSoundIndexForKey(key)];
          } else if (key === 'CapsLock' || key === 'Caps') {
            soundData = (profile as any).caps || (profile as any).generic[getSoundIndexForKey(key)];
          } else {
            // Use consistent sound mapping for generic keys
            const soundIndex = getSoundIndexForKey(key);
            soundData = (profile as any).generic[soundIndex];
          }
        } else {
          // For Holy Pandas and SteelSeries - use consistent sound mapping for generic keys
          const soundIndex = getSoundIndexForKey(key);
          soundData = (profile as any).generic[soundIndex];
        }
      } else {
        // For Banana Split and MX Speed Silver - ALL keys use the evenly distributed generic sounds
        // This includes Space, Enter, Backspace - they all get mapped to available sounds
        const soundIndex = getSoundIndexForKey(key);
        soundData = (profile as any).generic[soundIndex];
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
    
    // Debug logging
    console.log('Key pressed:', { key, code });
    
    if (code === 'Space') {
      event.preventDefault();
      playKeyboardSound('Space');
    } else if (code === 'Enter') {
      playKeyboardSound('Enter');
    } else if (code === 'Backspace') {
      playKeyboardSound('Backspace');
    } else if (code === 'Tab') {
      event.preventDefault();
      playKeyboardSound('Tab');
    } else if (code === 'ShiftLeft' || code === 'ShiftRight') {
      playKeyboardSound('Shift');
    } else if (code === 'ControlLeft' || code === 'ControlRight') {
      playKeyboardSound('Ctrl');
    } else if (code === 'CapsLock') {
      playKeyboardSound('Caps');
    } else if (code.startsWith('Key') || code.startsWith('Digit')) {
      // Use the actual key character for consistent mapping
      playKeyboardSound(key.toUpperCase());
    }
  };

  const handleProfileChange = (profileId: keyof typeof SOUND_PROFILES) => {
    setSelectedProfile(profileId);
    currentGenericIndex.current = 0; // Reset generic sound index
    keyToSoundMap.current.clear(); // Clear key mappings for new profile
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
      {/* Keyboard Test Input */}
      <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          🧪 Mac Keyboard Test - Type here to verify your keyboard works:
        </label>
        <input
          type="text"
          value={testText}
          onChange={(e) => {
            setTestText(e.target.value);
            console.log('📝 Text input changed:', e.target.value);
          }}
          onKeyDown={(e) => {
            console.log('📝 Input keydown:', { key: e.key, code: e.code });
          }}
          placeholder="Type anything here to test your Mac keyboard..."
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="text-xs text-slate-400 mt-1">
          Current text: "{testText}" (Length: {testText.length})
        </div>
      </div>

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
                  {profile.name} ({(profile.sounds as any).generic?.length || 0} sounds{profile.hasSpecialKeys ? ' + special keys' : ''})
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
                🎵 {(currentProfile.sounds as any).generic?.length || 0} sounds
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
              🎵 Test Sound (Mapped)
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
            ref={keyboardRef}
            className="bg-slate-800/30 p-4 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
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
                {(currentProfile.sounds as any).generic?.length || 0} sounds
                {currentProfile.hasSpecialKeys && ' + special key sounds'}
              </p>
              <p className="text-slate-500 text-xs mt-2">
                All sounds embedded as base64 • Works in Shopify WebViews
              </p>
              {isPlaying && (
                <p className="text-blue-400 text-xs mt-2 animate-pulse">
                  🎵 Playing: {currentlyPlayingKey === 'generic' 
                    ? `Sound ${(currentGenericIndex.current % ((currentProfile.sounds as any).generic?.length || 1)) || ((currentProfile.sounds as any).generic?.length || 1)}` 
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

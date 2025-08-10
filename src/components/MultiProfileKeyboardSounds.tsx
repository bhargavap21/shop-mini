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
  const keyboardRef = useRef<HTMLTextAreaElement>(null);


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
      
      // Try to take over audio focus to minimize system sounds
      try {
        // Request audio session control (iOS)
        if ('webkitAudioContext' in window) {
          console.log('🎵 Attempting to take iOS audio session control...');
          
          // Create a silent audio buffer to maintain audio context priority
          const silentBuffer = audioContextRef.current.createBuffer(1, 1, 22050);
          const silentSource = audioContextRef.current.createBufferSource();
          silentSource.buffer = silentBuffer;
          silentSource.connect(audioContextRef.current.destination);
          silentSource.start();
          
          console.log('✅ Audio session control established');
        }
      } catch (sessionError) {
        console.warn('Audio session control failed:', sessionError);
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



  const handleProfileChange = (profileId: keyof typeof SOUND_PROFILES) => {
    setSelectedProfile(profileId);
    currentGenericIndex.current = 0; // Reset generic sound index
    keyToSoundMap.current.clear(); // Clear key mappings for new profile
  };

  // No longer need keyboard layout - using native iOS keyboard

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

          {/* Native iOS Keyboard Input */}
          <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-medium text-white mb-4 text-center">
              📱 Native iPhone Keyboard
            </h3>
            <p className="text-slate-400 text-sm text-center mb-4">
              Tap the text area below to open your iPhone keyboard.<br/>
              Every key you type will play the selected switch sound!
            </p>
            
            {/* iOS Keyboard Sound Instructions */}
            <div className="mb-4 p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-amber-400 text-lg">⚠️</span>
                <div>
                  <p className="text-amber-200 text-sm font-medium mb-1">
                    iOS Keyboard Sounds Notice
                  </p>
                  <p className="text-amber-300/80 text-xs leading-relaxed">
                    For the best experience, disable iOS keyboard sounds:<br/>
                    <span className="font-medium text-amber-200">iPhone Settings → Sounds & Haptics → Keyboard Clicks → OFF</span><br/>
                    <span className="text-amber-400/60">This prevents double audio (iOS + our custom sounds)</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Large text input area optimized for iOS */}
            <textarea
              ref={keyboardRef}
              value={testText}
              onChange={(e) => {
                setTestText(e.target.value);
                console.log('📱 Native iOS keyboard input:', e.target.value);
              }}
              onKeyDown={(e) => {
                console.log('📱 Native iOS key event:', { key: e.key, code: e.code });
                if (audioInitialized) {
                  playKeyboardSound(e.key);
                }
              }}
              onInput={(e) => {
                // Also capture input events for better iOS compatibility
                const target = e.target as HTMLTextAreaElement;
                console.log('📱 iOS input event:', target.value);
                
                // Try to play our sound on input event too (for better iOS compatibility)
                if (audioInitialized && target.value.length > testText.length) {
                  const newChar = target.value[target.value.length - 1];
                  playKeyboardSound(newChar);
                }
              }}
              onFocus={() => {
                console.log('📱 Input focused - iOS keyboard should appear');
                // Try to minimize system interactions when our input is focused
                const bodyStyle = document.body.style as any;
                bodyStyle.webkitUserSelect = 'none';
                bodyStyle.webkitTouchCallout = 'none';
              }}
              onBlur={() => {
                console.log('📱 Input blurred - iOS keyboard hidden');
                // Re-enable selections when not focused
                const bodyStyle = document.body.style as any;
                bodyStyle.webkitUserSelect = '';
                bodyStyle.webkitTouchCallout = '';
              }}
              placeholder="Tap here to open your iPhone keyboard and start typing..."
              className="w-full h-40 px-4 py-4 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
              style={{
                fontSize: '16px', // Prevents zoom on iOS Safari
                lineHeight: '1.6',
                WebkitAppearance: 'none', // Remove iOS styling
                WebkitBorderRadius: '12px', // Ensure rounded corners on iOS
                WebkitUserSelect: 'text', // Enable text selection in input
                WebkitTouchCallout: 'none', // Disable callouts/context menus
                WebkitTapHighlightColor: 'transparent' // Remove tap highlight
              }}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              // Additional iOS-specific attributes to minimize system sounds
              inputMode="text"
              enterKeyHint="done"
              // Attempt to reduce system audio feedback
              autoComplete="off"
              role="textbox"
              aria-label="Custom keyboard sound tester"
            />
            
            {/* Text info and controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-400">
                <span className="font-medium">{testText.length}</span> characters typed
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTestText('')}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors duration-200 font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    if (keyboardRef.current) {
                      keyboardRef.current.focus();
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors duration-200 font-medium"
                >
                  Focus Input
                </button>
              </div>
            </div>

            {/* Current sound feedback */}
            {isPlaying && (
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <p className="text-blue-300 text-sm text-center animate-pulse">
                  🎵 Playing: {currentlyPlayingKey === 'generic' 
                    ? `Sound ${(currentGenericIndex.current % ((currentProfile.sounds as any).generic?.length || 1)) || ((currentProfile.sounds as any).generic?.length || 1)}` 
                    : currentlyPlayingKey}
                </p>
              </div>
            )}
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

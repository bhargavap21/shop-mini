import React, { useState, useEffect, useRef } from 'react';

type SoundFormat = 'multi_press' | 'multi_press_release' | 'single_sprite';

interface SoundProfile {
  id: string;
  name: string;
  format: SoundFormat;
  path: string;
  config: any;
}

interface KeyLayout {
  key: string;
  code: string;
  label: string;
  width?: number;
  row: number;
  col: number;
}

const QWERTY_LAYOUT: KeyLayout[] = [
  // Row 0 (Number row)
  { key: '`', code: 'Backquote', label: '`', row: 0, col: 0 },
  { key: '1', code: 'Digit1', label: '1', row: 0, col: 1 },
  { key: '2', code: 'Digit2', label: '2', row: 0, col: 2 },
  { key: '3', code: 'Digit3', label: '3', row: 0, col: 3 },
  { key: '4', code: 'Digit4', label: '4', row: 0, col: 4 },
  { key: '5', code: 'Digit5', label: '5', row: 0, col: 5 },
  { key: '6', code: 'Digit6', label: '6', row: 0, col: 6 },
  { key: '7', code: 'Digit7', label: '7', row: 0, col: 7 },
  { key: '8', code: 'Digit8', label: '8', row: 0, col: 8 },
  { key: '9', code: 'Digit9', label: '9', row: 0, col: 9 },
  { key: '0', code: 'Digit0', label: '0', row: 0, col: 10 },
  { key: '-', code: 'Minus', label: '-', row: 0, col: 11 },
  { key: '=', code: 'Equal', label: '=', row: 0, col: 12 },
  { key: 'Backspace', code: 'Backspace', label: '⌫', width: 2, row: 0, col: 13 },

  // Row 1 (QWERTY)
  { key: 'Tab', code: 'Tab', label: 'Tab', width: 1.5, row: 1, col: 0 },
  { key: 'q', code: 'KeyQ', label: 'Q', row: 1, col: 1 },
  { key: 'w', code: 'KeyW', label: 'W', row: 1, col: 2 },
  { key: 'e', code: 'KeyE', label: 'E', row: 1, col: 3 },
  { key: 'r', code: 'KeyR', label: 'R', row: 1, col: 4 },
  { key: 't', code: 'KeyT', label: 'T', row: 1, col: 5 },
  { key: 'y', code: 'KeyY', label: 'Y', row: 1, col: 6 },
  { key: 'u', code: 'KeyU', label: 'U', row: 1, col: 7 },
  { key: 'i', code: 'KeyI', label: 'I', row: 1, col: 8 },
  { key: 'o', code: 'KeyO', label: 'O', row: 1, col: 9 },
  { key: 'p', code: 'KeyP', label: 'P', row: 1, col: 10 },
  { key: '[', code: 'BracketLeft', label: '[', row: 1, col: 11 },
  { key: ']', code: 'BracketRight', label: ']', row: 1, col: 12 },
  { key: '\\', code: 'Backslash', label: '\\', width: 1.5, row: 1, col: 13 },

  // Row 2 (ASDF)
  { key: 'CapsLock', code: 'CapsLock', label: 'Caps', width: 1.75, row: 2, col: 0 },
  { key: 'a', code: 'KeyA', label: 'A', row: 2, col: 1 },
  { key: 's', code: 'KeyS', label: 'S', row: 2, col: 2 },
  { key: 'd', code: 'KeyD', label: 'D', row: 2, col: 3 },
  { key: 'f', code: 'KeyF', label: 'F', row: 2, col: 4 },
  { key: 'g', code: 'KeyG', label: 'G', row: 2, col: 5 },
  { key: 'h', code: 'KeyH', label: 'H', row: 2, col: 6 },
  { key: 'j', code: 'KeyJ', label: 'J', row: 2, col: 7 },
  { key: 'k', code: 'KeyK', label: 'K', row: 2, col: 8 },
  { key: 'l', code: 'KeyL', label: 'L', row: 2, col: 9 },
  { key: ';', code: 'Semicolon', label: ';', row: 2, col: 10 },
  { key: "'", code: 'Quote', label: "'", row: 2, col: 11 },
  { key: 'Enter', code: 'Enter', label: 'Enter', width: 2.25, row: 2, col: 12 },

  // Row 3 (ZXCV)
  { key: 'Shift', code: 'ShiftLeft', label: 'Shift', width: 2.25, row: 3, col: 0 },
  { key: 'z', code: 'KeyZ', label: 'Z', row: 3, col: 1 },
  { key: 'x', code: 'KeyX', label: 'X', row: 3, col: 2 },
  { key: 'c', code: 'KeyC', label: 'C', row: 3, col: 3 },
  { key: 'v', code: 'KeyV', label: 'V', row: 3, col: 4 },
  { key: 'b', code: 'KeyB', label: 'B', row: 3, col: 5 },
  { key: 'n', code: 'KeyN', label: 'N', row: 3, col: 6 },
  { key: 'm', code: 'KeyM', label: 'M', row: 3, col: 7 },
  { key: ',', code: 'Comma', label: ',', row: 3, col: 8 },
  { key: '.', code: 'Period', label: '.', row: 3, col: 9 },
  { key: '/', code: 'Slash', label: '/', row: 3, col: 10 },
  { key: 'ShiftRight', code: 'ShiftRight', label: 'Shift', width: 2.75, row: 3, col: 11 },

  // Row 4 (Bottom row)
  { key: 'Control', code: 'ControlLeft', label: 'Ctrl', width: 1.25, row: 4, col: 0 },
  { key: 'Meta', code: 'MetaLeft', label: 'Cmd', width: 1.25, row: 4, col: 1 },
  { key: 'Alt', code: 'AltLeft', label: 'Alt', width: 1.25, row: 4, col: 2 },
  { key: ' ', code: 'Space', label: ' ', width: 6.25, row: 4, col: 3 },
  { key: 'AltGraph', code: 'AltRight', label: 'Alt', width: 1.25, row: 4, col: 4 },
  { key: 'ContextMenu', code: 'ContextMenu', label: 'Menu', width: 1.25, row: 4, col: 5 },
  { key: 'ControlRight', code: 'ControlRight', label: 'Ctrl', width: 1.25, row: 4, col: 6 },
];

export function KeyboardSoundTester() {
  const [availableProfiles, setAvailableProfiles] = useState<SoundProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<SoundProfile | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [supportedFormats, setSupportedFormats] = useState<Set<string>>(new Set());
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const contextRef = useRef<AudioContext | null>(null);
  const spriteAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    detectSupportedFormats();
    setupAudioContext();
    attachKeyboardListeners();

    return () => {
      detachKeyboardListeners();
      if (contextRef.current) {
        contextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (supportedFormats.size > 0) {
      loadSoundProfiles();
    }
  }, [supportedFormats]);

  const detectSupportedFormats = () => {
    const audio = document.createElement('audio');
    const formats = new Set<string>();

    // Test common formats with stricter requirements
    const testFormats = [
      { ext: 'mp3', mime: 'audio/mpeg' },
      { ext: 'wav', mime: 'audio/wav' },
      { ext: 'ogg', mime: 'audio/ogg; codecs="vorbis"' },
      { ext: 'm4a', mime: 'audio/mp4' },
      { ext: 'aac', mime: 'audio/aac' }
    ];

    testFormats.forEach(({ ext, mime }) => {
      const support = audio.canPlayType(mime);
      // Only accept "probably" or "maybe" - be more strict
      if (support === 'probably' || support === 'maybe') {
        formats.add(ext);
        console.log(`✅ ${ext.toUpperCase()} format: ${support}`);
      } else {
        console.log(`❌ ${ext.toUpperCase()} format: not supported`);
      }
    });

    // For iOS Safari, be extra cautious with OGG
    const userAgent = navigator.userAgent;
    const isIOSSafari = /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    
    if (isIOSSafari && formats.has('ogg')) {
      console.log('🚫 Removing OGG support - iOS Safari detected');
      formats.delete('ogg');
    }

    console.log('Final supported audio formats:', Array.from(formats));
    setSupportedFormats(formats);
  };

  const setupAudioContext = async () => {
    try {
      contextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // On iOS Safari, AudioContext starts suspended and needs user interaction
      if (contextRef.current.state === 'suspended') {
        // Wait for first user interaction to resume
        const resumeAudio = async () => {
          if (contextRef.current && contextRef.current.state === 'suspended') {
            await contextRef.current.resume();
            setIsAudioInitialized(true);
            document.removeEventListener('touchstart', resumeAudio);
            document.removeEventListener('click', resumeAudio);
          }
        };
        
        document.addEventListener('touchstart', resumeAudio, { once: true });
        document.addEventListener('click', resumeAudio, { once: true });
      } else {
        setIsAudioInitialized(true);
      }
    } catch (error) {
      console.warn('AudioContext not supported:', error);
      setIsAudioInitialized(true); // Fallback to HTML5 audio
    }
  };

  const isProfileSupported = (config: any, format: SoundFormat): boolean => {
    if (format === 'multi_press') {
      // Check if any wav files are supported
      return supportedFormats.has('wav');
    } else if (format === 'multi_press_release') {
      // Check if mp3 is supported
      return supportedFormats.has('mp3');
    } else if (format === 'single_sprite') {
      // Check if the audio file format is supported
      const soundFile = config.sound || '';
      const extension = soundFile.split('.').pop()?.toLowerCase();
      return extension ? supportedFormats.has(extension) : false;
    }
    return false;
  };

  const loadSoundProfiles = async () => {
    try {
      const profiles: SoundProfile[] = [];

      // FOR TESTING: Force load only Holy Pandas (MP3) profile first
      console.log('🎯 Testing MP3 profile only...');
      try {
        const configPath = '/kbd_sounds_formatted/multi_press_release/holy-pandas/config.json';
        const response = await fetch(configPath);
        if (response.ok) {
          const config = await response.json();
          profiles.push({
            id: 'multi_press_release_holy-pandas',
            name: config.name || 'Holy Pandas (MP3)',
            format: 'multi_press_release',
            path: '/kbd_sounds_formatted/multi_press_release/holy-pandas',
            config
          });
          console.log('✅ Holy Pandas MP3 profile loaded');
        }
      } catch (error) {
        console.warn('❌ Failed to load holy-pandas profile:', error);
      }

      // Only add other profiles if MP3 test works
      if (profiles.length > 0) {
        console.log('🎯 MP3 profile loaded, skipping others for now...');
      } else {
        console.log('❌ MP3 profile failed, trying WAV profiles...');
        
        // Multi-press profiles (WAV files) - only if MP3 failed
        if (supportedFormats.has('wav')) {
          const multiPressProfiles = ['banana split lubed']; // Just test one WAV
          
          for (const profileName of multiPressProfiles) {
            const configPath = `/kbd_sounds_formatted/multi_press/${profileName}/config.json`;
            try {
              const response = await fetch(configPath);
              if (response.ok) {
                const config = await response.json();
                profiles.push({
                  id: `multi_press_${profileName}`,
                  name: config.name || `${profileName} (WAV)`,
                  format: 'multi_press',
                  path: `/kbd_sounds_formatted/multi_press/${profileName}`,
                  config
                });
                console.log(`✅ ${profileName} WAV profile loaded`);
              }
            } catch (error) {
              console.warn(`❌ Failed to load multi_press profile ${profileName}:`, error);
            }
          }
        }
      }

      console.log(`🔊 Final: ${profiles.length} sound profiles loaded`);
      setAvailableProfiles(profiles);
      
      // Auto-load first profile
      if (profiles.length > 0) {
        loadProfile(profiles[0]);
      } else {
        console.error('❌ No audio profiles could be loaded!');
      }
    } catch (error) {
      console.error('Failed to load sound profiles:', error);
    }
  };

  const loadProfile = async (profile: SoundProfile) => {
    setIsLoading(true);
    setCurrentProfile(profile);
    
    // Clear previous audio cache
    audioCache.current.clear();

    try {
      await preloadSounds(profile);
      console.log(`Loaded profile: ${profile.name}`);
    } catch (error) {
      console.error(`Failed to load profile ${profile.name}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const preloadSounds = async (profile: SoundProfile) => {
    const cache = audioCache.current;
    
    if (profile.format === 'multi_press') {
      // Load individual sound files based on config
      const soundFiles = new Set<string>();
      if (profile.config.defines) {
        Object.values(profile.config.defines).forEach((soundFile: any) => {
          if (typeof soundFile === 'string') {
            soundFiles.add(soundFile);
          }
        });
      }
      
      for (const soundFile of soundFiles) {
        try {
          const audio = new Audio();
          audio.preload = 'auto';
          audio.volume = volume;
          audio.crossOrigin = 'anonymous';
          audio.src = `${profile.path}/${soundFile}`;
          
          // iOS Safari requires load() call
          audio.load();
          cache.set(soundFile, audio);
        } catch (error) {
          console.warn(`Failed to preload ${soundFile}:`, error);
        }
      }
    } else if (profile.format === 'multi_press_release') {
      // Load press and release sounds
      if (profile.config.defines) {
        for (const [key, soundFile] of Object.entries(profile.config.defines)) {
          if (typeof soundFile === 'string') {
            try {
              const audio = new Audio();
              audio.preload = 'auto';
              audio.volume = volume;
              audio.crossOrigin = 'anonymous';
              audio.src = `${profile.path}/${soundFile}`;
              audio.load();
              cache.set(key, audio);
            } catch (error) {
              console.warn(`Failed to preload ${soundFile}:`, error);
            }
          }
        }
      }
      
      // Load default sounds
      if (profile.config.sound) {
        for (let i = 0; i < 5; i++) {
          const defaultSound = profile.config.sound.replace('{0-4}', i.toString());
          try {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.volume = volume;
            audio.crossOrigin = 'anonymous';
            audio.src = `${profile.path}/${defaultSound}`;
            audio.load();
            cache.set(`default_${i}`, audio);
          } catch (error) {
            console.warn(`Failed to preload ${defaultSound}:`, error);
          }
        }
      }
    } else if (profile.format === 'single_sprite') {
      // Load the single sprite file
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.volume = volume;
        audio.crossOrigin = 'anonymous';
        audio.src = `${profile.path}/${profile.config.sound}`;
        audio.load();
        
        // Store reference for sprite playback
        spriteAudioRef.current = audio;
        cache.set('sprite', audio);
      } catch (error) {
        console.warn('Failed to preload sprite audio:', error);
      }
    }
  };

  const getKeyCodeFromPhysical = (code: string): string => {
    // Map physical keyboard codes to our key indices for sound mapping
    const keyMap: { [key: string]: string } = {
      'Backquote': '41',
      'Digit1': '2', 'Digit2': '3', 'Digit3': '4', 'Digit4': '5', 'Digit5': '6',
      'Digit6': '7', 'Digit7': '8', 'Digit8': '9', 'Digit9': '10', 'Digit0': '11',
      'Minus': '12', 'Equal': '13', 'Backspace': '14',
      'Tab': '15', 'KeyQ': '16', 'KeyW': '17', 'KeyE': '18', 'KeyR': '19', 'KeyT': '20',
      'KeyY': '21', 'KeyU': '22', 'KeyI': '23', 'KeyO': '24', 'KeyP': '25',
      'BracketLeft': '26', 'BracketRight': '27', 'Enter': '28',
      'CapsLock': '58', 'KeyA': '30', 'KeyS': '31', 'KeyD': '32', 'KeyF': '33',
      'KeyG': '34', 'KeyH': '35', 'KeyJ': '36', 'KeyK': '37', 'KeyL': '38',
      'Semicolon': '39', 'Quote': '40', 'Backslash': '43',
      'ShiftLeft': '42', 'KeyZ': '44', 'KeyX': '45', 'KeyC': '46', 'KeyV': '47',
      'KeyB': '48', 'KeyN': '49', 'KeyM': '50', 'Comma': '51', 'Period': '52',
      'Slash': '53', 'ShiftRight': '54',
      'ControlLeft': '29', 'MetaLeft': '3675', 'AltLeft': '56', 'Space': '57',
      'AltRight': '3640', 'ContextMenu': '3677', 'ControlRight': '3613'
    };
    
    return keyMap[code] || '57'; // Default to space
  };

  const playKeySound = async (keyCode: string, isRelease: boolean = false) => {
    if (!currentProfile || !isAudioInitialized) return;

    try {
      const cache = audioCache.current;
      let audio: HTMLAudioElement | null = null;

      if (currentProfile.format === 'multi_press') {
        // Find the sound for this key
        const soundFile = currentProfile.config.defines?.[keyCode];
        if (soundFile && cache.has(soundFile)) {
          audio = cache.get(soundFile)!;
        }
      } else if (currentProfile.format === 'multi_press_release') {
        const suffix = isRelease ? '-up' : '';
        const key = `${keyCode}${suffix}`;
        
        if (cache.has(key)) {
          audio = cache.get(key)!;
        } else if (!isRelease) {
          // Use random default sound
          const randomNum = Math.floor(Math.random() * 5);
          const defaultKey = `default_${randomNum}`;
          if (cache.has(defaultKey)) {
            audio = cache.get(defaultKey)!;
          }
        }
      } else if (currentProfile.format === 'single_sprite') {
        // For single sprite, create a new audio instance for precise timing
        if (spriteAudioRef.current && currentProfile.config.defines?.[keyCode]) {
          const [startTime, duration] = currentProfile.config.defines[keyCode];
          
          // Create a new instance for iOS compatibility
          audio = new Audio();
          audio.src = spriteAudioRef.current.src;
          audio.volume = volume;
          
          // Set up sprite playback - convert milliseconds to seconds
          const startSeconds = startTime / 1000;
          const durationMs = duration;
          
          // Wait for audio to be ready then seek and play
          audio.addEventListener('canplaythrough', async () => {
            try {
              audio!.currentTime = startSeconds;
              await audio!.play();
              
              // Stop after duration
              setTimeout(() => {
                if (audio && !audio.paused) {
                  audio.pause();
                  audio.currentTime = 0;
                }
              }, durationMs);
            } catch (seekError) {
              console.warn('Sprite seek failed, playing from start:', seekError);
              try {
                await audio!.play();
                setTimeout(() => {
                  if (audio && !audio.paused) {
                    audio.pause();
                  }
                }, durationMs);
              } catch (playError) {
                console.warn('Sprite play failed:', playError);
              }
            }
          }, { once: true });
          
          audio.load();
          return; // Early return for sprite audio
        }
      }

      if (audio) {
        // Reset audio for clean playback
        if (audio.currentTime > 0) {
          audio.currentTime = 0;
        }
        audio.volume = volume;
        
        // For iOS Safari, we need to handle the play promise properly
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      }
    } catch (error) {
      // More specific error handling for iOS
      if (error.name === 'NotSupportedError') {
        console.warn('Audio format not supported on this device');
      } else if (error.name === 'NotAllowedError') {
        console.warn('Audio playback not allowed - need user interaction');
        setIsAudioInitialized(false);
      } else {
        console.warn('Failed to play sound:', error);
      }
    }
  };

  const handleKeyPress = (keyCode: string, isRelease: boolean = false) => {
    // Visual feedback
    if (!isRelease) {
      setPressedKeys(prev => new Set(prev).add(keyCode));
      setTimeout(() => {
        setPressedKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(keyCode);
          return newSet;
        });
      }, 150);
    }

    // Play sound
    playKeySound(keyCode, isRelease);
  };

  const attachKeyboardListeners = () => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const keyCode = getKeyCodeFromPhysical(event.code);
      handleKeyPress(keyCode, false);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (currentProfile?.format === 'multi_press_release') {
        const keyCode = getKeyCodeFromPhysical(event.code);
        handleKeyPress(keyCode, true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Store for cleanup
    (window as any)._keyboardHandlers = { handleKeyDown, handleKeyUp };
  };

  const detachKeyboardListeners = () => {
    const handlers = (window as any)._keyboardHandlers;
    if (handlers) {
      document.removeEventListener('keydown', handlers.handleKeyDown);
      document.removeEventListener('keyup', handlers.handleKeyUp);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // Update all cached audio volumes
    audioCache.current.forEach(audio => {
      audio.volume = newVolume;
    });
  };

  const getKeyClass = (key: KeyLayout) => {
    const isPressed = pressedKeys.has(getKeyCodeFromPhysical(key.code));
    const baseClass = "relative bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-white text-xs font-medium transition-all duration-150 flex items-center justify-center select-none cursor-pointer min-h-[2.5rem]";
    const pressedClass = isPressed ? "bg-blue-600 border-blue-500 transform translate-y-0.5 shadow-lg" : "";
    
    let widthClass = "w-10";
    if (key.width) {
      if (key.width >= 6) widthClass = "w-24";
      else if (key.width >= 2.5) widthClass = "w-16";
      else if (key.width >= 2) widthClass = "w-14";
      else if (key.width >= 1.5) widthClass = "w-12";
    }
    
    return `${baseClass} ${widthClass} ${pressedClass}`;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Keyboard Sound Tester</h2>
        <p className="text-slate-400 text-sm">
          Test different switch sounds. Click keys or use your physical keyboard.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sound Profile Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Sound Profile
          </label>
          <select
            value={currentProfile?.id || ''}
            onChange={(e) => {
              const profile = availableProfiles.find(p => p.id === e.target.value);
              if (profile) loadProfile(profile);
            }}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">Select a sound profile...</option>
            {availableProfiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name} ({profile.format.replace(/_/g, ' ')})
              </option>
            ))}
          </select>
        </div>

        {/* Volume Control */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Status */}
      {currentProfile && (
        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{currentProfile.name}</h3>
              <p className="text-slate-400 text-sm">
                Format: {currentProfile.format.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {!isAudioInitialized && (
                <div className="flex items-center space-x-2 text-amber-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 6v12" />
                  </svg>
                  <span className="text-xs">Tap to enable audio</span>
                </div>
              )}
              {isLoading && (
                <div className="flex items-center space-x-2 text-blue-400">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Audio Initialization Button for iOS */}
      {!isAudioInitialized && (
        <div className="mb-6 p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
          <h3 className="text-amber-400 font-medium mb-2">Audio Setup Required</h3>
          <p className="text-amber-300/70 text-sm mb-4">
            Tap the button below to enable keyboard sounds on your device
          </p>
          <button
            onClick={async () => {
              try {
                if (contextRef.current && contextRef.current.state === 'suspended') {
                  await contextRef.current.resume();
                }
                setIsAudioInitialized(true);
                
                // Test audio playback with a simple beep
                const testAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+H2yHkpBSuSzePKfzIGHm7A7OKdUAoSVqXj77FdGCBDl93yyny+PoGF0+DYhS8EJHfI8N2OPQoUXbPn66hSFQxBm+D6x3kqByuTzvLEfSkHNYHX7d2NNwcAY');
                await testAudio.play();
              } catch (error) {
                console.warn('Failed to initialize audio:', error);
              }
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            🔊 Enable Audio
          </button>
        </div>
      )}

      {/* No supported profiles message */}
      {availableProfiles.length === 0 && supportedFormats.size > 0 && (
        <div className="mb-6 p-6 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center">
          <h3 className="text-orange-400 font-medium mb-2">No Compatible Sound Profiles</h3>
          <p className="text-orange-300/70 text-sm mb-2">
            Your device supports: {Array.from(supportedFormats).join(', ')}
          </p>
          <p className="text-orange-300/70 text-xs">
            The available sound profiles use formats not supported by your browser.
            Try using a different browser or device for full compatibility.
          </p>
        </div>
      )}

      {/* Virtual Keyboard */}
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
        <div className="space-y-2 max-w-4xl mx-auto">
          {[0, 1, 2, 3, 4].map(rowIndex => {
            const rowKeys = QWERTY_LAYOUT.filter(key => key.row === rowIndex);
            return (
              <div key={rowIndex} className="flex justify-center space-x-1 flex-wrap">
                {rowKeys.map((key) => (
                  <button
                    key={key.code}
                    onClick={() => handleKeyPress(getKeyCodeFromPhysical(key.code))}
                    className={getKeyClass(key)}
                    disabled={!currentProfile}
                    title={`${key.label} (${key.code})`}
                  >
                    {key.label}
                    {pressedKeys.has(getKeyCodeFromPhysical(key.code)) && (
                      <div className="absolute inset-0 bg-blue-400/20 rounded-lg animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-slate-500 text-xs">
          💡 Use your physical keyboard or click the virtual keys above to test sounds
        </p>
        <p className="text-slate-500 text-xs mt-1">
          🎵 {availableProfiles.length} sound profiles available across 3 formats
        </p>
      </div>

      {/* Debug Info */}
      <details className="mt-4">
        <summary className="text-slate-400 text-xs cursor-pointer hover:text-slate-300">
          Debug Info
        </summary>
        <div className="mt-2 p-3 bg-slate-800 rounded text-xs text-slate-400 font-mono space-y-1">
          <div>Audio Initialized: {isAudioInitialized ? '✅' : '❌'}</div>
          <div>AudioContext State: {contextRef.current?.state || 'None'}</div>
          <div>Supported Formats: {Array.from(supportedFormats).join(', ') || 'None detected'}</div>
          <div>Current Profile: {currentProfile?.name || 'None'}</div>
          <div>Format: {currentProfile?.format || 'None'}</div>
          <div>Available Profiles: {availableProfiles.length}</div>
          <div>Volume: {Math.round(volume * 100)}%</div>
          <div>Cached Sounds: {audioCache.current.size}</div>
          <div className="mt-2 pt-2 border-t border-slate-700">
            <button
              onClick={async () => {
                try {
                  console.log('Testing basic audio...');
                  const testAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+H2yHkpBSuSzePKfzIGHm7A7OKdUAoSVqXj77FdGCBDl93yyny+PoGF0+DYhS8EJHfI8N2OPQoUXbPn66hSFQxBm+D6x3kqByuTzvLEfSkHNYHX7d2NNwcAY');
                  testAudio.volume = volume;
                  await testAudio.play();
                  console.log('✅ Test audio played successfully');
                } catch (error) {
                  console.error('❌ Test audio failed:', error);
                }
              }}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Test Audio
            </button>
          </div>
        </div>
      </details>
    </div>
  );
}
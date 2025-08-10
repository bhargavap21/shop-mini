/**
 * React hook for easy keyboard sound integration
 * This provides a clean API for your team to use
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { KeyboardSoundSystem } from '../KeyboardSoundSystem';
import { SoundPackMeta } from '../types/SoundTypes';

export interface UseKeyboardSoundOptions {
  volume?: number;
  preloadSounds?: boolean;
  autoAttachListeners?: boolean;
  fallbackEnabled?: boolean;
}

export interface UseKeyboardSoundReturn {
  // Core functionality
  playKeySound: (keyCode: string, isRelease?: boolean) => Promise<void>;
  playFromKeyboardEvent: (event: KeyboardEvent, isRelease?: boolean) => Promise<void>;
  loadSoundPack: (packPath: string) => Promise<void>;
  
  // State
  isReady: boolean;
  isLoading: boolean;
  currentSoundPack: SoundPackMeta | null;
  availableSoundPacks: SoundPackMeta[];
  
  // Controls
  volume: number;
  setVolume: (volume: number) => void;
  
  // Lifecycle
  attachKeyboardListeners: (element?: HTMLElement) => void;
  detachKeyboardListeners: (element?: HTMLElement) => void;
  
  // Utilities
  searchSoundPacks: (query: string) => Promise<SoundPackMeta[]>;
  getRecommendedSoundPacks: () => Promise<SoundPackMeta[]>;
}

/**
 * Custom hook for keyboard sound functionality
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { 
 *     isReady, 
 *     loadSoundPack, 
 *     availableSoundPacks,
 *     playKeySound 
 *   } = useKeyboardSound();
 *   
 *   useEffect(() => {
 *     if (availableSoundPacks.length > 0) {
 *       loadSoundPack(availableSoundPacks[0].path);
 *     }
 *   }, [availableSoundPacks]);
 *   
 *   return (
 *     <button onClick={() => playKeySound('30')}>
 *       Test A Key Sound
 *     </button>
 *   );
 * }
 * ```
 */
export function useKeyboardSound(options: UseKeyboardSoundOptions = {}): UseKeyboardSoundReturn {
  const soundSystemRef = useRef<KeyboardSoundSystem | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSoundPack, setCurrentSoundPack] = useState<SoundPackMeta | null>(null);
  const [availableSoundPacks, setAvailableSoundPacks] = useState<SoundPackMeta[]>([]);
  const [volume, setVolumeState] = useState(options.volume ?? 0.7);

  // Initialize sound system
  useEffect(() => {
    const initSoundSystem = async () => {
      try {
        soundSystemRef.current = new KeyboardSoundSystem({
          volume: options.volume,
          preloadSounds: options.preloadSounds,
          fallbackEnabled: options.fallbackEnabled,
        });

        await soundSystemRef.current.initialize();
        
        const packs = await soundSystemRef.current.getAvailableSoundPacks();
        setAvailableSoundPacks(packs);
        setIsReady(true);

        // Auto-attach keyboard listeners if requested
        if (options.autoAttachListeners !== false) {
          soundSystemRef.current.attachKeyboardListeners();
        }
      } catch (error) {
        console.error('Failed to initialize keyboard sound system:', error);
      }
    };

    initSoundSystem();

    // Cleanup
    return () => {
      if (soundSystemRef.current) {
        soundSystemRef.current.dispose();
      }
    };
  }, []);

  // Play key sound
  const playKeySound = useCallback(async (keyCode: string, isRelease: boolean = false): Promise<void> => {
    if (!soundSystemRef.current) return;
    await soundSystemRef.current.playKeySound(keyCode, isRelease);
  }, []);

  // Play from keyboard event
  const playFromKeyboardEvent = useCallback(async (event: KeyboardEvent, isRelease: boolean = false): Promise<void> => {
    if (!soundSystemRef.current) return;
    await soundSystemRef.current.playFromKeyboardEvent(event, isRelease);
  }, []);

  // Load sound pack
  const loadSoundPack = useCallback(async (packPath: string): Promise<void> => {
    if (!soundSystemRef.current) return;
    
    setIsLoading(true);
    try {
      await soundSystemRef.current.loadSoundPack(packPath);
      const pack = soundSystemRef.current.getCurrentSoundPack();
      setCurrentSoundPack(pack);
    } catch (error) {
      console.error('Failed to load sound pack:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set volume
  const setVolume = useCallback((newVolume: number): void => {
    if (!soundSystemRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    soundSystemRef.current.setVolume(clampedVolume);
    setVolumeState(clampedVolume);
  }, []);

  // Attach keyboard listeners
  const attachKeyboardListeners = useCallback((element?: HTMLElement): void => {
    if (!soundSystemRef.current) return;
    soundSystemRef.current.attachKeyboardListeners(element);
  }, []);

  // Detach keyboard listeners
  const detachKeyboardListeners = useCallback((element?: HTMLElement): void => {
    if (!soundSystemRef.current) return;
    soundSystemRef.current.detachKeyboardListeners(element);
  }, []);

  // Search sound packs
  const searchSoundPacks = useCallback(async (query: string): Promise<SoundPackMeta[]> => {
    if (!soundSystemRef.current) return [];
    return soundSystemRef.current.searchSoundPacks(query);
  }, []);

  // Get recommended sound packs
  const getRecommendedSoundPacks = useCallback(async (): Promise<SoundPackMeta[]> => {
    if (!soundSystemRef.current) return [];
    return soundSystemRef.current.getRecommendedSoundPacks();
  }, []);

  return {
    // Core functionality
    playKeySound,
    playFromKeyboardEvent,
    loadSoundPack,
    
    // State
    isReady,
    isLoading,
    currentSoundPack,
    availableSoundPacks,
    
    // Controls
    volume,
    setVolume,
    
    // Lifecycle
    attachKeyboardListeners,
    detachKeyboardListeners,
    
    // Utilities
    searchSoundPacks,
    getRecommendedSoundPacks,
  };
}
/**
 * Demo component for testing keyboard sound functionality
 * This will be easy for your team to integrate later
 */

import React, { useEffect, useState, useRef } from 'react';
import { KeyboardSoundSystem } from '../KeyboardSoundSystem';
import { SoundPackMeta } from '../types/SoundTypes';
import { QWERTY_LAYOUT } from '../utils/KeyMapping';

interface KeyboardSoundDemoProps {
  className?: string;
}

export function KeyboardSoundDemo({ className = '' }: KeyboardSoundDemoProps) {
  const [soundSystem] = useState(() => new KeyboardSoundSystem());
  const [isInitialized, setIsInitialized] = useState(false);
  const [availablePacks, setAvailablePacks] = useState<SoundPackMeta[]>([]);
  const [currentPack, setCurrentPack] = useState<SoundPackMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize sound system
  useEffect(() => {
    const init = async () => {
      try {
        await soundSystem.initialize();
        const packs = await soundSystem.getAvailableSoundPacks();
        setAvailablePacks(packs);
        setIsInitialized(true);
        
        // Load default pack (MX Speed Silver)
        const defaultPack = packs.find(p => p.name === 'MX Speed Silver') || packs[0];
        if (defaultPack) {
          await loadSoundPack(defaultPack.path);
        }
      } catch (error) {
        console.error('Failed to initialize sound system:', error);
      }
    };

    init();

    return () => {
      soundSystem.dispose();
    };
  }, [soundSystem]);

  // Attach keyboard listeners
  useEffect(() => {
    if (isInitialized && containerRef.current) {
      soundSystem.attachKeyboardListeners(document.body);
      return () => {
        soundSystem.detachKeyboardListeners(document.body);
      };
    }
  }, [isInitialized, soundSystem]);

  const loadSoundPack = async (packPath: string) => {
    setIsLoading(true);
    try {
      await soundSystem.loadSoundPack(packPath);
      const pack = availablePacks.find(p => p.path === packPath);
      setCurrentPack(pack || null);
    } catch (error) {
      console.error('Failed to load sound pack:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyClick = async (keyCode: string) => {
    // Visual feedback
    setPressedKeys(prev => new Set(prev).add(keyCode));
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyCode);
        return newSet;
      });
    }, 150);

    // Play sound
    await soundSystem.playKeySound(keyCode);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    soundSystem.setVolume(newVolume);
  };

  const getKeyClass = (keyCode: string, rowIndex: number, keyIndex: number) => {
    const baseClass = "relative bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-white text-xs font-medium transition-all duration-150 flex items-center justify-center select-none cursor-pointer";
    const pressedClass = pressedKeys.has(keyCode) ? "bg-blue-600 border-blue-500 transform translate-y-0.5 shadow-lg" : "";
    
    // Different sizes for different keys
    let sizeClass = "h-10 w-10"; // Default key size
    
    // Specific key sizing
    const key = QWERTY_LAYOUT.find(k => k.code === keyCode);
    if (key) {
      switch (key.physical) {
        case 'Backspace':
        case 'Tab':
        case 'CapsLock':
        case 'ShiftLeft':
        case 'ShiftRight':
          sizeClass = "h-10 w-16";
          break;
        case 'Enter':
          sizeClass = "h-10 w-20";
          break;
        case 'Space':
          sizeClass = "h-10 w-32";
          break;
        case 'ControlLeft':
        case 'ControlRight':
        case 'MetaLeft':
        case 'MetaRight':
          sizeClass = "h-10 w-12";
          break;
      }
    }
    
    return `${baseClass} ${sizeClass} ${pressedClass}`;
  };

  return (
    <div ref={containerRef} className={`p-6 bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Keyboard Sound System Demo</h2>
        <p className="text-slate-400 text-sm">
          Test different switch sounds. Click keys or use your physical keyboard.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sound Pack Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Switch Type
          </label>
          <select
            value={currentPack?.path || ''}
            onChange={(e) => loadSoundPack(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">Select a sound pack...</option>
            {availablePacks.map((pack) => (
              <option key={pack.path} value={pack.path}>
                {pack.name} ({pack.format})
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
      {currentPack && (
        <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{currentPack.name}</h3>
              <p className="text-slate-400 text-sm">
                Format: {currentPack.format} | Type: {currentPack.type}
              </p>
            </div>
            {isLoading && (
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Virtual Keyboard */}
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map(rowIndex => {
            const rowKeys = QWERTY_LAYOUT.filter(key => key.row === rowIndex);
            return (
              <div key={rowIndex} className="flex justify-center space-x-1 flex-wrap">
                {rowKeys.map((key) => (
                  <button
                    key={key.code}
                    onClick={() => handleKeyClick(key.code)}
                    className={getKeyClass(key.code, rowIndex, key.col)}
                    disabled={!currentPack}
                    title={`${key.label} (${key.physical})`}
                  >
                    {key.label || key.physical}
                    {pressedKeys.has(key.code) && (
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
          💡 Tip: Use your physical keyboard or click the virtual keys above to test sounds
        </p>
        <p className="text-slate-500 text-xs mt-1">
          🎵 {availablePacks.length} sound packs available across {new Set(availablePacks.map(p => p.format)).size} formats
        </p>
      </div>

      {/* Debug Info */}
      <details className="mt-4">
        <summary className="text-slate-400 text-xs cursor-pointer hover:text-slate-300">
          Debug Info
        </summary>
        <div className="mt-2 p-3 bg-slate-800 rounded text-xs text-slate-400 font-mono">
          <div>Initialized: {isInitialized ? '✅' : '❌'}</div>
          <div>Ready: {soundSystem.isReady() ? '✅' : '❌'}</div>
          <div>Current Pack: {currentPack?.name || 'None'}</div>
          <div>Available Packs: {availablePacks.length}</div>
          <div>Volume: {Math.round(volume * 100)}%</div>
        </div>
      </details>
    </div>
  );
}
/**
 * Main Keyboard Sound System
 * Orchestrates different sound managers and provides a unified API
 */

import { SoundManager, SoundPackMeta, SoundSystemOptions } from './types/SoundTypes';
import { MultiPressSoundManager } from './sound-managers/MultiPressSoundManager';
import { SingleSpriteSoundManager } from './sound-managers/SingleSpriteSoundManager';
import { MultiPressReleaseSoundManager } from './sound-managers/MultiPressReleaseSoundManager';
import { SoundPackDiscovery } from './utils/SoundPackDiscovery';
import { getKeyCodeFromEvent } from './utils/KeyMapping';

export class KeyboardSoundSystem {
  private currentManager: SoundManager | null = null;
  private currentSoundPack: SoundPackMeta | null = null;
  private audioContext: AudioContext | null = null;
  private options: SoundSystemOptions;
  private keyListeners: Map<string, (event: KeyboardEvent) => void> = new Map();

  constructor(options: SoundSystemOptions = {}) {
    this.options = {
      volume: 0.7,
      preloadSounds: true,
      fallbackEnabled: true,
      ...options
    };
  }

  /**
   * Initialize the sound system
   */
  async initialize(): Promise<void> {
    try {
      // Create shared AudioContext
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.options.audioContext = this.audioContext;
      
      console.log('KeyboardSoundSystem initialized');
    } catch (error) {
      console.warn('AudioContext initialization failed:', error);
    }
  }

  /**
   * Load a sound pack by path
   */
  async loadSoundPack(packPath: string): Promise<void> {
    const soundPackMeta = SoundPackDiscovery.getSoundPackMeta(packPath);
    if (!soundPackMeta) {
      throw new Error(`Sound pack not found: ${packPath}`);
    }

    // Dispose current manager
    if (this.currentManager) {
      this.currentManager.dispose();
    }

    // Create appropriate manager based on format
    switch (soundPackMeta.format) {
      case 'multi_press':
        this.currentManager = new MultiPressSoundManager(this.options);
        break;
      case 'single_sprite':
        this.currentManager = new SingleSpriteSoundManager(this.options);
        break;
      case 'multi_press_release':
        this.currentManager = new MultiPressReleaseSoundManager(this.options);
        break;
      default:
        throw new Error(`Unsupported sound pack format: ${soundPackMeta.format}`);
    }

    // Initialize and load the sound pack
    await this.currentManager.initialize();
    await this.currentManager.loadSoundPack(packPath);
    
    this.currentSoundPack = soundPackMeta;
    console.log(`Loaded sound pack: ${soundPackMeta.name}`);
  }

  /**
   * Play sound for a specific key code
   */
  async playKeySound(keyCode: string, isRelease: boolean = false): Promise<void> {
    if (!this.currentManager) {
      console.warn('No sound pack loaded');
      return;
    }

    try {
      // Handle release sounds for multi_press_release format
      if (this.currentSoundPack?.format === 'multi_press_release' && this.currentManager instanceof MultiPressReleaseSoundManager) {
        await this.currentManager.playKeySound(keyCode, isRelease);
      } else {
        await this.currentManager.playKeySound(keyCode);
      }
    } catch (error) {
      console.error('Failed to play key sound:', error);
    }
  }

  /**
   * Play sound from keyboard event
   */
  async playFromKeyboardEvent(event: KeyboardEvent, isRelease: boolean = false): Promise<void> {
    const keyCode = getKeyCodeFromEvent(event);
    if (keyCode) {
      await this.playKeySound(keyCode, isRelease);
    }
  }

  /**
   * Add keyboard event listeners to an element
   */
  attachKeyboardListeners(element: HTMLElement = document.body): void {
    const keydownHandler = (event: KeyboardEvent) => {
      this.playFromKeyboardEvent(event, false);
    };

    const keyupHandler = (event: KeyboardEvent) => {
      if (this.currentSoundPack?.format === 'multi_press_release') {
        this.playFromKeyboardEvent(event, true);
      }
    };

    element.addEventListener('keydown', keydownHandler);
    element.addEventListener('keyup', keyupHandler);

    // Store handlers for cleanup
    this.keyListeners.set('keydown', keydownHandler);
    this.keyListeners.set('keyup', keyupHandler);
  }

  /**
   * Remove keyboard event listeners
   */
  detachKeyboardListeners(element: HTMLElement = document.body): void {
    const keydownHandler = this.keyListeners.get('keydown');
    const keyupHandler = this.keyListeners.get('keyup');

    if (keydownHandler) {
      element.removeEventListener('keydown', keydownHandler);
    }
    if (keyupHandler) {
      element.removeEventListener('keyup', keyupHandler);
    }

    this.keyListeners.clear();
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.options.volume = Math.max(0, Math.min(1, volume));
    if (this.currentManager) {
      this.currentManager.setVolume(this.options.volume);
    }
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.options.volume || 0.7;
  }

  /**
   * Get available sound packs
   */
  async getAvailableSoundPacks(): Promise<SoundPackMeta[]> {
    return SoundPackDiscovery.getAllSoundPacks();
  }

  /**
   * Get recommended sound packs
   */
  async getRecommendedSoundPacks(): Promise<SoundPackMeta[]> {
    return SoundPackDiscovery.getRecommendedSoundPacks();
  }

  /**
   * Search sound packs
   */
  async searchSoundPacks(query: string): Promise<SoundPackMeta[]> {
    return SoundPackDiscovery.searchSoundPacks(query);
  }

  /**
   * Get current sound pack info
   */
  getCurrentSoundPack(): SoundPackMeta | null {
    return this.currentSoundPack;
  }

  /**
   * Check if system is ready
   */
  isReady(): boolean {
    return this.currentManager?.isReady() || false;
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.detachKeyboardListeners();
    
    if (this.currentManager) {
      this.currentManager.dispose();
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }

    this.currentManager = null;
    this.currentSoundPack = null;
    this.audioContext = null;
  }
}
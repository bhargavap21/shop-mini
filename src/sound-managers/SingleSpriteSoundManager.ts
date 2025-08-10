/**
 * Sound manager for single_sprite format
 * Uses one audio file with time-based key definitions
 */

import { SoundManager, SoundPackConfig, SoundSystemOptions } from '../types/SoundTypes';

export class SingleSpriteSoundManager implements SoundManager {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private htmlAudio: HTMLAudioElement | null = null;
  private currentSoundPack: SoundPackConfig | null = null;
  private soundPackBasePath: string = '';
  private volume: number = 0.7;
  private isInitialized: boolean = false;
  private activeNodes: Set<AudioBufferSourceNode> = new Set();

  constructor(private options: SoundSystemOptions = {}) {
    this.volume = options.volume || 0.7;
  }

  async initialize(): Promise<void> {
    try {
      this.audioContext = this.options.audioContext || 
        new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.isInitialized = true;
      console.log('SingleSpriteSoundManager initialized');
    } catch (error) {
      console.warn('AudioContext initialization failed:', error);
      this.isInitialized = false;
    }
  }

  async loadSoundPack(packPath: string): Promise<void> {
    try {
      const configResponse = await fetch(`${packPath}/config.json`);
      if (!configResponse.ok) {
        throw new Error(`Failed to load config: ${configResponse.status}`);
      }
      
      const config: SoundPackConfig = await configResponse.json();
      this.currentSoundPack = config;
      this.soundPackBasePath = packPath;
      
      console.log(`Loaded single_sprite sound pack: ${config.name}`);
      
      // Preload the sprite file if enabled
      if (this.options.preloadSounds && config.sound) {
        await this.loadSpriteAudio(config.sound);
      }
    } catch (error) {
      console.error('Failed to load sound pack:', error);
      throw error;
    }
  }

  private async loadSpriteAudio(soundFile: string): Promise<void> {
    const soundUrl = `${this.soundPackBasePath}/${soundFile}`;
    
    try {
      // Try to load with WebAudio
      if (this.audioContext) {
        const response = await fetch(soundUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        console.log('Loaded sprite audio with WebAudio');
        return;
      }
    } catch (error) {
      console.warn('Failed to load sprite with WebAudio, falling back to HTMLAudio:', error);
    }

    // Fallback to HTMLAudio
    try {
      this.htmlAudio = new Audio(soundUrl);
      this.htmlAudio.preload = 'auto';
      console.log('Loaded sprite audio with HTMLAudio');
    } catch (error) {
      console.error('Failed to load sprite audio:', error);
    }
  }

  async playKeySound(keyCode: string): Promise<void> {
    if (!this.currentSoundPack) {
      console.warn('No sound pack loaded');
      return;
    }

    if (!this.isInitialized) {
      await this.initialize();
    }

    const keyDefine = this.currentSoundPack.defines[keyCode];
    if (!keyDefine || !Array.isArray(keyDefine) || keyDefine.length < 2) {
      console.warn(`No valid sound definition for key ${keyCode}`);
      return;
    }

    const [startMs, durationMs] = keyDefine as number[];

    try {
      // Try WebAudio first
      if (this.audioBuffer && this.audioContext) {
        this.playWithWebAudio(startMs, durationMs);
        return;
      } else if (!this.audioBuffer && this.currentSoundPack.sound) {
        // Load sprite if not already loaded
        await this.loadSpriteAudio(this.currentSoundPack.sound);
        if (this.audioBuffer && this.audioContext) {
          this.playWithWebAudio(startMs, durationMs);
          return;
        }
      }
    } catch (error) {
      console.warn('WebAudio playback failed, trying HTMLAudio:', error);
    }

    // Fallback to HTMLAudio (approximation - plays whole file)
    try {
      await this.playWithHtmlAudio();
    } catch (error) {
      console.error('All playback methods failed:', error);
    }
  }

  private playWithWebAudio(startMs: number, durationMs: number): void {
    if (!this.audioContext || !this.audioBuffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = this.audioBuffer;
    gainNode.gain.value = this.volume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Convert milliseconds to seconds
    const startTime = startMs / 1000;
    const duration = durationMs / 1000;
    
    source.start(0, startTime, duration);
    this.activeNodes.add(source);
    
    source.onended = () => {
      this.activeNodes.delete(source);
    };
  }

  private async playWithHtmlAudio(): Promise<void> {
    if (!this.htmlAudio) {
      if (this.currentSoundPack?.sound) {
        await this.loadSpriteAudio(this.currentSoundPack.sound);
      }
      if (!this.htmlAudio) return;
    }
    
    // Note: HTMLAudio can't easily play segments, so we play the whole file
    const clone = this.htmlAudio.cloneNode(true) as HTMLAudioElement;
    clone.volume = this.volume;
    clone.currentTime = 0; // Reset to beginning
    await clone.play();
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.volume;
  }

  isReady(): boolean {
    return this.isInitialized && this.currentSoundPack !== null;
  }

  dispose(): void {
    // Stop all active nodes
    for (const node of this.activeNodes) {
      try {
        node.stop();
      } catch {}
    }
    this.activeNodes.clear();

    // Clear audio references
    this.audioBuffer = null;
    this.htmlAudio = null;

    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }

    this.isInitialized = false;
  }
}
/**
 * Sound manager for multi_press format
 * Each key has its own WAV file
 */

import { SoundManager, SoundPackConfig, SoundSystemOptions } from '../types/SoundTypes';

export class MultiPressSoundManager implements SoundManager {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private htmlAudioCache: Map<string, HTMLAudioElement> = new Map();
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
      console.log('MultiPressSoundManager initialized');
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
      
      console.log(`Loaded multi_press sound pack: ${config.name}`);
      
      // Preload some common sounds if enabled
      if (this.options.preloadSounds) {
        await this.preloadCommonSounds();
      }
    } catch (error) {
      console.error('Failed to load sound pack:', error);
      throw error;
    }
  }

  private async preloadCommonSounds(): Promise<void> {
    if (!this.currentSoundPack) return;
    
    // Preload sounds for common keys (WASD, Space, Enter)
    const commonKeys = ['17', '30', '31', '32', '57', '28']; // W, A, S, D, Space, Enter
    const preloadPromises = commonKeys
      .map(keyCode => this.currentSoundPack!.defines[keyCode])
      .filter(soundFile => typeof soundFile === 'string')
      .map(soundFile => this.loadAudioBuffer(soundFile as string));
    
    await Promise.allSettled(preloadPromises);
    console.log('Preloaded common sounds');
  }

  private async loadAudioBuffer(soundFile: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    const soundUrl = `${this.soundPackBasePath}/${soundFile}`;
    
    if (this.audioBuffers.has(soundUrl)) {
      return this.audioBuffers.get(soundUrl)!;
    }

    try {
      const response = await fetch(soundUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.audioBuffers.set(soundUrl, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load WebAudio buffer for ${soundFile}, falling back to HTMLAudio:`, error);
      
      // Fallback to HTMLAudio
      try {
        if (!this.htmlAudioCache.has(soundUrl)) {
          const audio = new Audio(soundUrl);
          audio.preload = 'auto';
          this.htmlAudioCache.set(soundUrl, audio);
        }
      } catch {}
      
      return null;
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

    const soundFile = this.currentSoundPack.defines[keyCode];
    if (!soundFile || typeof soundFile !== 'string') {
      console.warn(`No sound defined for key ${keyCode}`);
      return;
    }

    try {
      // Try WebAudio first
      const audioBuffer = await this.loadAudioBuffer(soundFile);
      if (audioBuffer && this.audioContext) {
        this.playWithWebAudio(audioBuffer);
        return;
      }
    } catch (error) {
      console.warn('WebAudio playback failed, trying HTMLAudio:', error);
    }

    // Fallback to HTMLAudio
    try {
      await this.playWithHtmlAudio(`${this.soundPackBasePath}/${soundFile}`);
    } catch (error) {
      console.error('All playback methods failed:', error);
    }
  }

  private playWithWebAudio(audioBuffer: AudioBuffer): void {
    if (!this.audioContext) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = audioBuffer;
    gainNode.gain.value = this.volume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start(0);
    this.activeNodes.add(source);
    
    source.onended = () => {
      this.activeNodes.delete(source);
    };
  }

  private async playWithHtmlAudio(url: string): Promise<void> {
    let audio = this.htmlAudioCache.get(url);
    if (!audio) {
      audio = new Audio(url);
      audio.preload = 'auto';
      this.htmlAudioCache.set(url, audio);
    }
    
    const clone = audio.cloneNode(true) as HTMLAudioElement;
    clone.volume = this.volume;
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

    // Clear caches
    this.audioBuffers.clear();
    this.htmlAudioCache.clear();

    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }

    this.isInitialized = false;
  }
}
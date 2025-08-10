/**
 * Core types for the keyboard sound system
 */

export interface SoundPackConfig {
  id: string;
  name: string;
  key_define_type: 'single' | 'multi' | 'multi_release';
  includes_numpad: boolean;
  sound?: string; // Main sound file (for single sprite)
  defines: Record<string, string | number[]>; // Key mappings
  tags?: string[];
  description?: string;
  default?: boolean;
}

export interface SoundPackMeta {
  name: string;
  path: string;
  format: 'multi_press' | 'single_sprite' | 'multi_press_release';
  type: string;
  config?: SoundPackConfig;
}

export interface KeyMapping {
  physical: string; // Physical key like 'KeyA', 'KeyB'
  code: string; // Sound system key code like '30', '48'
  label: string; // Display label like 'A', 'B'
  row: number; // Keyboard row (0-4)
  col: number; // Position in row
}

export interface SoundSystemOptions {
  volume?: number;
  preloadSounds?: boolean;
  fallbackEnabled?: boolean;
  audioContext?: AudioContext;
}

export interface SoundManager {
  initialize(): Promise<void>;
  loadSoundPack(packPath: string): Promise<void>;
  playKeySound(keyCode: string): Promise<void>;
  setVolume(volume: number): void;
  getVolume(): number;
  dispose(): void;
  isReady(): boolean;
}
/**
 * Sound pack discovery and management
 * Scans the available sound packs and provides metadata
 */

import { SoundPackMeta, SoundPackConfig } from '../types/SoundTypes';

export class SoundPackDiscovery {
  private static soundPacks: SoundPackMeta[] = [
    // Multi-press format (individual WAV files)
    {
      name: 'MX Speed Silver',
      path: '/kbd_sounds_formatted/multi_press/mx-speed-silver',
      format: 'multi_press',
      type: 'Linear Switch'
    },
    {
      name: 'Banana Split Lubed',
      path: '/kbd_sounds_formatted/multi_press/banana split lubed',
      format: 'multi_press',
      type: 'Linear Switch'
    },
    {
      name: 'Tealios V2',
      path: '/kbd_sounds_formatted/multi_press/tealios-v2_Akira',
      format: 'multi_press',
      type: 'Linear Switch'
    },
    {
      name: 'SteelSeries Apex Pro TKL',
      path: '/kbd_sounds_formatted/multi_press/steelseries apex pro tkl',
      format: 'multi_press',
      type: 'Magnetic Switch'
    },

    // Single sprite format (one OGG file with time segments)
    {
      name: 'Cherry MX Blue',
      path: '/kbd_sounds_formatted/single_sprite/cherrymx-blue-pbt',
      format: 'single_sprite',
      type: 'Clicky Switch'
    },
    {
      name: 'Cherry MX Brown',
      path: '/kbd_sounds_formatted/single_sprite/cherrymx-brown-pbt',
      format: 'single_sprite',
      type: 'Tactile Switch'
    },
    {
      name: 'Cherry MX Red',
      path: '/kbd_sounds_formatted/single_sprite/cherrymx-red-pbt',
      format: 'single_sprite',
      type: 'Linear Switch'
    },
    {
      name: 'Cherry MX Black',
      path: '/kbd_sounds_formatted/single_sprite/cherrymx-black-pbt',
      format: 'single_sprite',
      type: 'Linear Switch'
    },
    {
      name: 'Topre Purple Hybrid',
      path: '/kbd_sounds_formatted/single_sprite/topre-purple-hybrid-pbt',
      format: 'single_sprite',
      type: 'Topre Switch'
    },

    // Multi-press release format (MP3 files with press/release)
    {
      name: 'Holy Pandas',
      path: '/kbd_sounds_formatted/multi_press_release/holy-pandas',
      format: 'multi_press_release',
      type: 'Tactile Switch'
    }
  ];

  /**
   * Get all available sound packs
   */
  static async getAllSoundPacks(): Promise<SoundPackMeta[]> {
    return [...this.soundPacks];
  }

  /**
   * Get sound packs by format
   */
  static async getSoundPacksByFormat(format: 'multi_press' | 'single_sprite' | 'multi_press_release'): Promise<SoundPackMeta[]> {
    return this.soundPacks.filter(pack => pack.format === format);
  }

  /**
   * Get sound packs by switch type
   */
  static async getSoundPacksByType(type: string): Promise<SoundPackMeta[]> {
    return this.soundPacks.filter(pack => pack.type.toLowerCase().includes(type.toLowerCase()));
  }

  /**
   * Load configuration for a specific sound pack
   */
  static async loadSoundPackConfig(packPath: string): Promise<SoundPackConfig> {
    const response = await fetch(`${packPath}/config.json`);
    if (!response.ok) {
      throw new Error(`Failed to load sound pack config: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Get sound pack metadata by path
   */
  static getSoundPackMeta(packPath: string): SoundPackMeta | null {
    return this.soundPacks.find(pack => pack.path === packPath) || null;
  }

  /**
   * Get recommended sound packs (featured ones)
   */
  static async getRecommendedSoundPacks(): Promise<SoundPackMeta[]> {
    // Return a curated list of recommended packs
    const recommendedPaths = [
      '/kbd_sounds_formatted/multi_press/mx-speed-silver',
      '/kbd_sounds_formatted/single_sprite/cherrymx-blue-pbt',
      '/kbd_sounds_formatted/multi_press/tealios-v2_Akira',
      '/kbd_sounds_formatted/multi_press_release/holy-pandas'
    ];

    return this.soundPacks.filter(pack => recommendedPaths.includes(pack.path));
  }

  /**
   * Search sound packs by name or type
   */
  static async searchSoundPacks(query: string): Promise<SoundPackMeta[]> {
    const lowerQuery = query.toLowerCase();
    return this.soundPacks.filter(pack => 
      pack.name.toLowerCase().includes(lowerQuery) ||
      pack.type.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Add a custom sound pack (for future extensibility)
   */
  static addCustomSoundPack(soundPack: SoundPackMeta): void {
    this.soundPacks.push(soundPack);
  }
}
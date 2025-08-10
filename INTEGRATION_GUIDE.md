# Keyboard Sound System Integration Guide

## Overview

This keyboard sound system provides a modular, TypeScript-friendly way to integrate realistic switch sounds into your custom keyboard builder app. It supports multiple sound formats and provides both high-level React hooks and low-level APIs for maximum flexibility.

## Features

- **Multiple Sound Formats**: Supports `multi_press` (WAV), `single_sprite` (OGG), and `multi_press_release` (MP3) formats
- **Automatic Format Detection**: System automatically loads the correct sound manager based on the pack format
- **Keyboard Mapping**: Complete QWERTY keyboard mapping with physical key to sound code translation
- **React Integration**: Clean hooks for easy React integration
- **Mobile Optimized**: iOS-compatible audio with fallbacks
- **TypeScript**: Full type safety throughout

## Quick Start

### 1. Using the React Hook (Recommended)

```tsx
import { useKeyboardSound } from './hooks/useKeyboardSound';

function MyKeyboardBuilder() {
  const { 
    isReady, 
    loadSoundPack, 
    availableSoundPacks,
    playKeySound,
    currentSoundPack,
    volume,
    setVolume 
  } = useKeyboardSound();

  // Load a default sound pack
  useEffect(() => {
    if (availableSoundPacks.length > 0) {
      const defaultPack = availableSoundPacks.find(p => p.name === 'MX Speed Silver');
      if (defaultPack) {
        loadSoundPack(defaultPack.path);
      }
    }
  }, [availableSoundPacks]);

  return (
    <div>
      <select onChange={(e) => loadSoundPack(e.target.value)}>
        {availableSoundPacks.map(pack => (
          <option key={pack.path} value={pack.path}>
            {pack.name} ({pack.type})
          </option>
        ))}
      </select>
      
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
      />
      
      <button onClick={() => playKeySound('30')}>
        Test A Key Sound
      </button>
      
      {/* Keyboard will automatically play sounds when typing */}
    </div>
  );
}
```

### 2. Using the Core System Directly

```tsx
import { KeyboardSoundSystem } from './KeyboardSoundSystem';

const soundSystem = new KeyboardSoundSystem({
  volume: 0.7,
  preloadSounds: true,
  fallbackEnabled: true
});

// Initialize
await soundSystem.initialize();

// Load a sound pack
await soundSystem.loadSoundPack('/kbd_sounds_formatted/multi_press/mx-speed-silver');

// Play sounds
await soundSystem.playKeySound('30'); // A key
await soundSystem.playKeySound('57'); // Space key

// Attach to keyboard events
soundSystem.attachKeyboardListeners();

// Cleanup when done
soundSystem.dispose();
```

## Available Sound Packs

### Multi-Press Format (Individual WAV files)
- **MX Speed Silver** - Linear switches
- **Banana Split Lubed** - Linear switches  
- **Tealios V2** - Linear switches
- **SteelSeries Apex Pro TKL** - Magnetic switches

### Single Sprite Format (Time-segmented OGG)
- **Cherry MX Blue** - Clicky switches
- **Cherry MX Brown** - Tactile switches
- **Cherry MX Red** - Linear switches
- **Cherry MX Black** - Linear switches
- **Topre Purple Hybrid** - Topre switches

### Multi-Press Release Format (MP3 with press/release)
- **Holy Pandas** - Tactile switches with release sounds

## Key Code Mapping

The system uses standardized key codes that map to physical keyboard positions:

```typescript
import { getKeyCodeFromEvent, QWERTY_LAYOUT } from './utils/KeyMapping';

// Get key code from keyboard event
document.addEventListener('keydown', (event) => {
  const keyCode = getKeyCodeFromEvent(event); // e.g., '30' for A key
  if (keyCode) {
    soundSystem.playKeySound(keyCode);
  }
});

// All available keys
console.log(QWERTY_LAYOUT); // Complete keyboard layout with codes
```

## Common Key Codes
- `'30'` - A key
- `'31'` - S key  
- `'32'` - D key
- `'57'` - Spacebar
- `'28'` - Enter
- `'14'` - Backspace

## Integration Patterns

### 1. Virtual Keyboard Component

```tsx
import { QWERTY_LAYOUT } from './utils/KeyMapping';
import { useKeyboardSound } from './hooks/useKeyboardSound';

function VirtualKeyboard() {
  const { playKeySound, isReady } = useKeyboardSound();
  
  return (
    <div className="virtual-keyboard">
      {QWERTY_LAYOUT.map((key) => (
        <button 
          key={key.code}
          onClick={() => playKeySound(key.code)}
          disabled={!isReady}
          className={`key row-${key.row}`}
        >
          {key.label}
        </button>
      ))}
    </div>
  );
}
```

### 2. Sound Pack Selector

```tsx
function SoundPackSelector() {
  const { 
    availableSoundPacks, 
    currentSoundPack, 
    loadSoundPack,
    isLoading 
  } = useKeyboardSound();
  
  return (
    <select 
      value={currentSoundPack?.path || ''} 
      onChange={(e) => loadSoundPack(e.target.value)}
      disabled={isLoading}
    >
      <option value="">Select switch type...</option>
      {availableSoundPacks.map((pack) => (
        <option key={pack.path} value={pack.path}>
          {pack.name} - {pack.type}
        </option>
      ))}
    </select>
  );
}
```

### 3. Custom Switch Types

```tsx
// Filter packs by switch type
const { searchSoundPacks } = useKeyboardSound();

const linearSwitches = await searchSoundPacks('linear');
const tactileSwitches = await searchSoundPacks('tactile');  
const clickySwitches = await searchSoundPacks('clicky');
```

## Mobile Optimization

The system automatically handles iOS audio restrictions:

```tsx
// The hook handles mobile optimization automatically
const { playKeySound } = useKeyboardSound({
  fallbackEnabled: true, // Enables HTML5 audio fallback
  autoAttachListeners: true // Auto-handles user gesture requirements
});

// For manual mobile optimization:
const soundSystem = new KeyboardSoundSystem({
  fallbackEnabled: true
});

// First user interaction unlocks audio on iOS
document.addEventListener('touchstart', async () => {
  await soundSystem.initialize();
}, { once: true });
```

## TypeScript Types

```typescript
import { 
  SoundPackMeta, 
  SoundSystemOptions, 
  KeyMapping 
} from './types/SoundTypes';

// Sound pack metadata
interface SoundPackMeta {
  name: string;
  path: string;
  format: 'multi_press' | 'single_sprite' | 'multi_press_release';
  type: string;
}

// System options
interface SoundSystemOptions {
  volume?: number;
  preloadSounds?: boolean;
  fallbackEnabled?: boolean;
  audioContext?: AudioContext;
}
```

## Performance Tips

1. **Preload Common Sounds**: Enable `preloadSounds: true` for better responsiveness
2. **Shared AudioContext**: The system automatically shares AudioContext across components
3. **Cleanup**: Always call `dispose()` or use the hook for automatic cleanup
4. **Volume Control**: Use the built-in volume controls rather than manipulating AudioContext directly

## File Structure

```
src/
├── KeyboardSoundSystem.ts          # Main orchestrator
├── types/SoundTypes.ts              # TypeScript definitions
├── utils/
│   ├── KeyMapping.ts                # QWERTY keyboard mapping
│   └── SoundPackDiscovery.ts        # Sound pack management
├── sound-managers/
│   ├── MultiPressSoundManager.ts    # WAV file handler
│   ├── SingleSpriteSoundManager.ts  # OGG sprite handler
│   └── MultiPressReleaseSoundManager.ts # MP3 press/release
├── hooks/
│   └── useKeyboardSound.ts          # React hook
└── components/
    └── KeyboardSoundDemo.tsx        # Demo implementation
```

## Adding Custom Sound Packs

```typescript
import { SoundPackDiscovery } from './utils/SoundPackDiscovery';

// Add a custom sound pack
SoundPackDiscovery.addCustomSoundPack({
  name: 'My Custom Switches',
  path: '/custom-sounds/my-switches',
  format: 'multi_press',
  type: 'Custom Switch'
});
```

## Troubleshooting

### No Sound on iOS
- Ensure user interaction occurred before playing sounds
- Check that the device isn't in silent mode
- The system automatically handles iOS audio unlocking

### Performance Issues
- Enable `preloadSounds: false` if memory is limited
- Use `multi_press` format for best performance
- Consider reducing the number of concurrent sound instances

### TypeScript Errors
- Ensure all types are imported from `./types/SoundTypes`
- Check that sound pack paths match exactly
- Verify key codes are strings, not numbers

This system is designed to be easily integrated into your existing app architecture while providing flexibility for future enhancements.
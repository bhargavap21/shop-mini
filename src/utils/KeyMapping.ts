/**
 * QWERTY keyboard to sound system key code mapping
 * Maps physical keyboard events to sound system key codes
 */

import { KeyMapping } from '../types/SoundTypes';

export const QWERTY_LAYOUT: KeyMapping[] = [
  // Row 0 - Number row
  { physical: 'Backquote', code: '41', label: '`', row: 0, col: 0 },
  { physical: 'Digit1', code: '1', label: '1', row: 0, col: 1 },
  { physical: 'Digit2', code: '2', label: '2', row: 0, col: 2 },
  { physical: 'Digit3', code: '3', label: '3', row: 0, col: 3 },
  { physical: 'Digit4', code: '4', label: '4', row: 0, col: 4 },
  { physical: 'Digit5', code: '5', label: '5', row: 0, col: 5 },
  { physical: 'Digit6', code: '6', label: '6', row: 0, col: 6 },
  { physical: 'Digit7', code: '7', label: '7', row: 0, col: 7 },
  { physical: 'Digit8', code: '8', label: '8', row: 0, col: 8 },
  { physical: 'Digit9', code: '9', label: '9', row: 0, col: 9 },
  { physical: 'Digit0', code: '10', label: '0', row: 0, col: 10 },
  { physical: 'Minus', code: '11', label: '-', row: 0, col: 11 },
  { physical: 'Equal', code: '12', label: '=', row: 0, col: 12 },
  { physical: 'Backspace', code: '14', label: '⌫', row: 0, col: 13 },

  // Row 1 - QWERTY row
  { physical: 'Tab', code: '15', label: '⇥', row: 1, col: 0 },
  { physical: 'KeyQ', code: '16', label: 'Q', row: 1, col: 1 },
  { physical: 'KeyW', code: '17', label: 'W', row: 1, col: 2 },
  { physical: 'KeyE', code: '18', label: 'E', row: 1, col: 3 },
  { physical: 'KeyR', code: '19', label: 'R', row: 1, col: 4 },
  { physical: 'KeyT', code: '20', label: 'T', row: 1, col: 5 },
  { physical: 'KeyY', code: '21', label: 'Y', row: 1, col: 6 },
  { physical: 'KeyU', code: '22', label: 'U', row: 1, col: 7 },
  { physical: 'KeyI', code: '23', label: 'I', row: 1, col: 8 },
  { physical: 'KeyO', code: '24', label: 'O', row: 1, col: 9 },
  { physical: 'KeyP', code: '25', label: 'P', row: 1, col: 10 },
  { physical: 'BracketLeft', code: '26', label: '[', row: 1, col: 11 },
  { physical: 'BracketRight', code: '27', label: ']', row: 1, col: 12 },
  { physical: 'Backslash', code: '28', label: '\\', row: 1, col: 13 },

  // Row 2 - ASDF row
  { physical: 'CapsLock', code: '58', label: '⇪', row: 2, col: 0 },
  { physical: 'KeyA', code: '30', label: 'A', row: 2, col: 1 },
  { physical: 'KeyS', code: '31', label: 'S', row: 2, col: 2 },
  { physical: 'KeyD', code: '32', label: 'D', row: 2, col: 3 },
  { physical: 'KeyF', code: '33', label: 'F', row: 2, col: 4 },
  { physical: 'KeyG', code: '34', label: 'G', row: 2, col: 5 },
  { physical: 'KeyH', code: '35', label: 'H', row: 2, col: 6 },
  { physical: 'KeyJ', code: '36', label: 'J', row: 2, col: 7 },
  { physical: 'KeyK', code: '37', label: 'K', row: 2, col: 8 },
  { physical: 'KeyL', code: '38', label: 'L', row: 2, col: 9 },
  { physical: 'Semicolon', code: '39', label: ';', row: 2, col: 10 },
  { physical: 'Quote', code: '40', label: "'", row: 2, col: 11 },
  { physical: 'Enter', code: '28', label: '↵', row: 2, col: 12 },

  // Row 3 - ZXCV row
  { physical: 'ShiftLeft', code: '42', label: '⇧', row: 3, col: 0 },
  { physical: 'KeyZ', code: '44', label: 'Z', row: 3, col: 1 },
  { physical: 'KeyX', code: '45', label: 'X', row: 3, col: 2 },
  { physical: 'KeyC', code: '46', label: 'C', row: 3, col: 3 },
  { physical: 'KeyV', code: '47', label: 'V', row: 3, col: 4 },
  { physical: 'KeyB', code: '48', label: 'B', row: 3, col: 5 },
  { physical: 'KeyN', code: '49', label: 'N', row: 3, col: 6 },
  { physical: 'KeyM', code: '50', label: 'M', row: 3, col: 7 },
  { physical: 'Comma', code: '51', label: ',', row: 3, col: 8 },
  { physical: 'Period', code: '52', label: '.', row: 3, col: 9 },
  { physical: 'Slash', code: '53', label: '/', row: 3, col: 10 },
  { physical: 'ShiftRight', code: '54', label: '⇧', row: 3, col: 11 },

  // Row 4 - Space row
  { physical: 'ControlLeft', code: '29', label: 'Ctrl', row: 4, col: 0 },
  { physical: 'MetaLeft', code: '56', label: '⌘', row: 4, col: 1 },
  { physical: 'AltLeft', code: '56', label: 'Alt', row: 4, col: 2 },
  { physical: 'Space', code: '57', label: '', row: 4, col: 3 },
  { physical: 'AltRight', code: '100', label: 'Alt', row: 4, col: 4 },
  { physical: 'MetaRight', code: '97', label: '⌘', row: 4, col: 5 },
  { physical: 'ControlRight', code: '97', label: 'Ctrl', row: 4, col: 6 },
];

/**
 * Create a lookup map from physical keys to key codes
 */
export const physicalToCode = new Map<string, string>(
  QWERTY_LAYOUT.map(key => [key.physical, key.code])
);

/**
 * Create a lookup map from key codes to key info
 */
export const codeToKey = new Map<string, KeyMapping>(
  QWERTY_LAYOUT.map(key => [key.code, key])
);

/**
 * Get key code from keyboard event
 */
export function getKeyCodeFromEvent(event: KeyboardEvent): string | null {
  return physicalToCode.get(event.code) || null;
}

/**
 * Get key info from key code
 */
export function getKeyInfo(keyCode: string): KeyMapping | null {
  return codeToKey.get(keyCode) || null;
}

/**
 * Get all keys in a specific row
 */
export function getKeysByRow(row: number): KeyMapping[] {
  return QWERTY_LAYOUT.filter(key => key.row === row);
}
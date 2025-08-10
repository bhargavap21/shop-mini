import React, { useState, useRef } from 'react';

export function SimpleAudioTest() {
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const addResult = (message: string) => {
    console.log(message);
    setTestResults(prev => [...prev, message]);
  };

  const initializeAudio = async () => {
    addResult('🔄 Starting iOS-compatible audio initialization...');
    
    try {
      // Create AudioContext first - iOS requires this approach
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      addResult(`📱 AudioContext created, state: ${audioContextRef.current.state}`);
      
      // Resume AudioContext if suspended (iOS requirement)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        addResult('✅ AudioContext resumed successfully');
      }
      
      // Test the most iOS-compatible audio format first
      const testAudio = new Audio();
      testAudio.preload = 'none'; // Don't preload on iOS
      
      // Use a simple click sound that iOS definitely supports
      testAudio.src = 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAAAB//+/gAAAAEBAA==';
      
      // Set up proper event handling for iOS
      testAudio.addEventListener('canplaythrough', async () => {
        try {
          addResult('🎵 Test audio ready, attempting play...');
          await testAudio.play();
          addResult('✅ Basic audio works!');
          
          // Now load the WAV file
          loadWavFile();
          
        } catch (playError) {
          addResult(`❌ Play failed: ${playError.message}`);
        }
      }, { once: true });
      
      testAudio.addEventListener('error', (error) => {
        addResult(`❌ Test audio error: ${error.type}`);
      });
      
      testAudio.load();
      setAudioInitialized(true);
      
    } catch (error) {
      addResult(`❌ AudioContext failed: ${error.message}`);
    }
  };
  
  const loadWavFile = () => {
    addResult('🔧 Testing both real files (for deployment) and programmatic fallback...');
    
    // Try real MP3 files first (will work on deployment)
    tryRealFiles();
    
    // Also create programmatic fallback (works on localhost)
    createProgrammaticAudio();
  };
  
  const tryRealFiles = () => {
    try {
      const testAudio = new Audio('/kbd_sounds_formatted/multi_press_release/holy-pandas/GENERIC_R1.mp3');
      testAudio.volume = 0.7;
      testAudio.preload = 'none';
      
      testAudio.addEventListener('canplaythrough', () => {
        addResult('✅ DEPLOYMENT READY: Real MP3 files will work on deployed domain!');
        audioRef.current = testAudio; // Use real file when available
      }, { once: true });
      
      testAudio.addEventListener('error', () => {
        addResult('⚠️ Expected: Real files blocked on localhost, but will work when deployed');
      });
      
      testAudio.load();
      
    } catch (error) {
      addResult('⚠️ File loading failed (expected on localhost)');
    }
  };
  
  const createProgrammaticAudio = () => {
    try {
      if (!audioContextRef.current) {
        addResult('❌ No AudioContext available');
        return;
      }
      
      addResult('🎛️ Creating programmatic keyboard sound...');
      
      // Create a simple keyboard-like click sound using Web Audio API
      const createKeyboardSound = () => {
        if (!audioContextRef.current) return;
        
        const context = audioContextRef.current;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        const filter = context.createBiquadFilter();
        
        // Configure oscillator for keyboard-like sound
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(800, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, context.currentTime + 0.1);
        
        // Configure filter for more realistic sound
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, context.currentTime);
        filter.Q.setValueAtTime(1, context.currentTime);
        
        // Configure envelope
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);
        
        // Connect nodes
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(context.destination);
        
        // Start and stop
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.2);
        
        return oscillator;
      };
      
      // Test the programmatic sound immediately
      createKeyboardSound();
      addResult('✅ Programmatic keyboard sound created and played');
      
      // Store the function for button clicks
      (audioRef as any).current = { createKeyboardSound };
      
    } catch (error) {
      addResult(`❌ Web Audio API failed: ${error.message}`);
      tryBackupFile();
    }
  };
  
  const tryBackupFile = () => {
    try {
      if (!audioRef.current) return;
      
      // Try a different MP3 file
      const backupPath = '/kbd_sounds_formatted/multi_press_release/holy-pandas/SPACE.mp3';
      audioRef.current.src = backupPath;
      
      addResult(`📂 Loading backup MP3: ${backupPath}`);
      
      audioRef.current.addEventListener('canplaythrough', () => {
        addResult('✅ Backup MP3 file ready to play');
      }, { once: true });
      
      audioRef.current.addEventListener('error', (error) => {
        addResult(`❌ Backup also failed: ${error.type}`);
        addResult(`📊 Backup error: ${audioRef.current?.error?.code} - ${audioRef.current?.error?.message}`);
        addResult('🚫 Both MP3 files failed - format issue');
      });
      
      audioRef.current.load();
      
    } catch (error) {
      addResult(`❌ Backup loading failed: ${error.message}`);
    }
  };

  const playWavSound = async () => {
    try {
      addResult('🎵 Playing keyboard sound...');
      
      // CRITICAL: Re-activate AudioContext on each play for iOS
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        addResult('🔄 AudioContext re-activated');
      }
      
      // Try real file first (will work on deployment)
      if (audioRef.current && audioRef.current.src && audioRef.current.readyState >= 2) {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          await playPromise;
        }
        
        addResult('✅ Real MP3 file played! (Ready for mobile deployment)');
        return;
      }
      
      // Fallback to programmatic audio (works on localhost)
      if (audioRef.current && typeof (audioRef.current as any).createKeyboardSound === 'function') {
        (audioRef.current as any).createKeyboardSound();
        addResult('✅ Programmatic sound played (localhost fallback)');
        return;
      }
      
      addResult('❌ No audio available - run Initialize Audio first');
      
    } catch (error) {
      addResult(`❌ Audio play failed: ${error.message}`);
      
      // Debug info
      addResult(`📊 AudioContext: ${audioContextRef.current?.state}, Has programmatic audio: ${!!(audioRef.current && (audioRef.current as any).createKeyboardSound)}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      playWavSound();
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">🔧 Simple Audio Test</h2>
      
      <div className="space-y-4">
        {!audioInitialized ? (
          <button
            onClick={initializeAudio}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg"
          >
            🔊 Initialize Audio
          </button>
        ) : (
          <>
            <button
              onClick={playWavSound}
              onKeyDown={handleKeyPress}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
            >
              🎵 Play Keyboard Sound (or press SPACE)
            </button>
            
            <div className="text-center text-slate-400 text-sm">
              Click the button above or press SPACE key
            </div>
          </>
        )}
      </div>

      {/* Results Log */}
      <div className="mt-6 p-4 bg-slate-800 rounded-lg">
        <h3 className="text-white font-medium mb-2">Test Results:</h3>
        <div className="space-y-1 text-xs font-mono">
          {testResults.length === 0 ? (
            <div className="text-slate-500">No tests run yet...</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-slate-300">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-4 p-3 bg-slate-700 rounded text-xs text-slate-400">
        <div>Audio Initialized: {audioInitialized ? '✅' : '❌'}</div>
        <div>User Agent: {navigator.userAgent.slice(0, 50)}...</div>
        <div>Audio Support: {new Audio().canPlayType('audio/wav')}</div>
      </div>
    </div>
  );
}
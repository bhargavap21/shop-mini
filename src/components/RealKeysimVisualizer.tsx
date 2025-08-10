import { useEffect, useRef, useState } from 'react'
import keysimInit from '../keysim/keysimAdapter'
import { stateAdapter } from '../keysim/stateAdapter'
import LAYOUTS from '../keysim/config/layouts/layouts'
import COLORWAYS from '../keysim/config/colorways/colorways'

interface RealKeysimVisualizerProps {
  keyboardConfig: {
    layout: string
    switches: string
    keycaps: string
    case: string
    plate: string
    stabilizers: string
  }
  onClose: () => void
}

export function RealKeysimVisualizer({ keyboardConfig, onClose }: RealKeysimVisualizerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const keysimRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedColorway, setSelectedColorway] = useState('wob')
  const [currentLayout, setCurrentLayout] = useState('60')

  // Convert our layout names to Keysim format
  const getKeysimLayout = (layout: string) => {
    switch (layout) {
      case 'tkl': return '80'
      case '60': return '60' 
      case 'full': return '100'
      case '65': return '65'
      default: return '60'
    }
  }

  useEffect(() => {
    if (!mountRef.current) return

    const initKeysim = () => {
      try {
        console.log('🚀 Initializing REAL KEYSIM...')
        
        // Set initial layout
        const keysimLayout = getKeysimLayout(keyboardConfig.layout)
        stateAdapter.setLayout(keysimLayout)
        stateAdapter.setColorway(selectedColorway)
        
        // Initialize Keysim with proper config
        keysimRef.current = keysimInit(mountRef.current, {
          layout: keysimLayout,
          colorway: selectedColorway,
          caseColor: '#333333',
          caseMaterial: 'matte'
        })
        
        setIsLoaded(true)
        console.log('✅ REAL KEYSIM LOADED SUCCESSFULLY!')
        
      } catch (error) {
        console.error('❌ Keysim initialization failed:', error)
        setIsLoaded(false)
      }
    }

    initKeysim()

    // Cleanup
    return () => {
      if (keysimRef.current && typeof keysimRef.current === 'function') {
        keysimRef.current() // Call cleanup function
      }
    }
  }, [])

  // Handle layout changes - state adapter will auto-update the scene
  useEffect(() => {
    if (isLoaded) {
      const keysimLayout = getKeysimLayout(currentLayout)
      stateAdapter.setLayout(keysimLayout)
    }
  }, [currentLayout, isLoaded])

  // Handle colorway changes - state adapter will auto-update the scene
  useEffect(() => {
    if (isLoaded) {
      stateAdapter.setColorway(selectedColorway)
    }
  }, [selectedColorway, isLoaded])

  // Available layouts from Keysim
  const availableLayouts = [
    { key: '60', name: '60% Compact', keys: 61 },
    { key: '65', name: '65% Arrow Keys', keys: 68 },
    { key: '80', name: 'TKL (80%)', keys: 87 },
    { key: '100', name: 'Full Size', keys: 104 }
  ]

  // Available colorways from Keysim
  const availableColorways = [
    { key: 'wob', name: 'White on Black', data: COLORWAYS.wob },
    { key: 'bow', name: 'Black on White', data: COLORWAYS.bow },
    { key: 'olivia', name: 'GMK Olivia', data: COLORWAYS.olivia },
    { key: 'botanical', name: 'GMK Botanical', data: COLORWAYS.botanical },
    { key: 'laser', name: 'GMK Laser', data: COLORWAYS.laser },
    { key: 'metropolis', name: 'GMK Metropolis', data: COLORWAYS.metropolis },
    { key: 'dracula', name: 'GMK Dracula', data: COLORWAYS.dracula || COLORWAYS.wob },
    { key: 'mizu', name: 'GMK Mizu', data: COLORWAYS.mizu },
  ].filter(colorway => colorway.data) // Only include colorways that exist

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
      <div className="pt-4 px-4 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">REAL Keysim Visualizer</h1>
              <p className="text-slate-400 text-sm">Original Three.js rendering engine</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
            <span className="text-slate-300 text-xs">{isLoaded ? 'Keysim Ready' : 'Loading...'}</span>
          </div>
        </div>

        {/* 3D Viewport - REAL KEYSIM RENDERING */}
        <div className="mb-6 h-96 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
          <div ref={mountRef} className="w-full h-full" />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white text-sm">Loading Keysim Engine...</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 gap-4">
          {/* Layout Selection */}
          <div>
            <h3 className="text-white font-medium mb-3">Keyboard Layout</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableLayouts.map((layout) => (
                <button
                  key={layout.key}
                  onClick={() => setCurrentLayout(layout.key)}
                  className={`p-3 rounded-xl border transition-all duration-200 text-left ${
                    currentLayout === layout.key
                      ? 'bg-blue-500/20 border-blue-400 text-white'
                      : 'bg-slate-900/40 border-slate-700/50 text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="font-medium text-sm">{layout.name}</div>
                  <div className="text-xs opacity-70">{layout.keys} keys</div>
                </button>
              ))}
            </div>
          </div>

          {/* Colorway Selection */}
          <div>
            <h3 className="text-white font-medium mb-3">Keysim Colorways</h3>
            <div className="grid grid-cols-1 gap-2">
              {availableColorways.map((colorway) => (
                <button
                  key={colorway.key}
                  onClick={() => setSelectedColorway(colorway.key)}
                  className={`p-3 rounded-xl border transition-all duration-200 text-left flex items-center space-x-3 ${
                    selectedColorway === colorway.key
                      ? 'bg-blue-500/20 border-blue-400 text-white'
                      : 'bg-slate-900/40 border-slate-700/50 text-slate-300 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex space-x-1">
                    <div 
                      className="w-4 h-4 rounded-sm border border-white/20" 
                      style={{ backgroundColor: colorway.data?.swatches?.base?.background || '#333' }}
                    />
                    <div 
                      className="w-4 h-4 rounded-sm border border-white/20" 
                      style={{ backgroundColor: colorway.data?.swatches?.mods?.background || '#333' }}
                    />
                    <div 
                      className="w-4 h-4 rounded-sm border border-white/20" 
                      style={{ backgroundColor: colorway.data?.swatches?.accent?.background || '#333' }}
                    />
                  </div>
                  <div className="font-medium text-sm">{colorway.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/50 text-center">
          <p className="text-slate-500 text-xs">
            Powered by <a href="https://keyboardsimulator.xyz" className="text-blue-400 hover:text-blue-300">Real Keysim</a> • Three.js Rendering Engine
          </p>
        </div>
      </div>
    </div>
  )
}

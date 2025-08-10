import { useState, useEffect } from 'react'
import { KeyboardSoundTester } from './components/KeyboardSoundTester'
import { SimpleAudioTest } from './components/SimpleAudioTest'
import { ShopifyKeyboardSounds } from './components/ShopifyKeyboardSounds'

// Types for our keyboard configuration
interface KeyboardConfig {
  layout: 'ansi' | 'iso' | '60' | '65' | 'tkl' | 'full'
  switches: 'linear' | 'tactile' | 'clicky'
  keycaps: 'cherry' | 'oem' | 'sa' | 'xda'
  case: 'aluminum' | 'plastic' | 'wood' | 'carbon'
  plate: 'steel' | 'aluminum' | 'brass' | 'pc'
  stabilizers: 'cherry' | 'durock' | 'zeal'
}

type AppPage = 'welcome' | 'preferences' | 'builder' | 'sound-test'

export function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('welcome')
  const [keyboardConfig, setKeyboardConfig] = useState<KeyboardConfig>({
    layout: 'tkl',
    switches: 'tactile',
    keycaps: 'cherry',
    case: 'aluminum',
    plate: 'aluminum',
    stabilizers: 'durock'
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Welcome/Landing Page with INSANE animations
  if (currentPage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950 overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-slate-400/20 rounded-full animate-pulse transform transition-all duration-[3000ms] ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 150}ms`,
                animationDuration: `${3000 + i * 200}ms`
              }}
            />
          ))}
        </div>

        <div className="relative">
          {/* Gradient overlay with animation */}
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/30 to-slate-950/60 transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`} />
          
          <div className="relative pt-16 px-6 pb-12">
            {/* Spinning Keycap Logo - HERO ANIMATION */}
            <div className="text-center mb-16">
              <div className={`relative inline-block mb-8 transform transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0 rotate-0 scale-100' : 'opacity-0 translate-y-20 rotate-180 scale-50'
              } animate-float`}>
                {/* 3D Keycap with K letter */}
                <div className="relative w-24 h-24 mx-auto">
                  {/* Outer glow ring */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-full blur-2xl animate-spin-slow" />
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-violet-500/40 rounded-full blur-xl animate-glow-pulse" />
                  
                  {/* Keycap base with enhanced 3D effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 rounded-2xl border border-slate-500/60 shadow-2xl transform rotate-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-2xl" />
                  </div>
                  <div className="absolute inset-1 bg-gradient-to-br from-slate-500 via-slate-600 to-slate-800 rounded-xl border border-slate-400/40">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30 rounded-xl" />
                  </div>
                  
                  {/* Keycap top surface */}
                  <div className="absolute inset-2 bg-gradient-to-br from-slate-400 via-slate-500 to-slate-700 rounded-lg border border-slate-300/50 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-lg" />
                  </div>
                  
                  {/* Epic spinning K letter with multiple effects */}
                  <div className={`absolute inset-0 flex items-center justify-center transform transition-transform duration-2000 ${
                    isLoaded ? 'rotate-[1080deg]' : 'rotate-0'
                  }`}>
                    <div className="relative">
                      {/* Letter shadow */}
                      <span className="absolute inset-0 text-3xl font-black text-black/50 blur-sm transform translate-x-0.5 translate-y-0.5">
                        K
                      </span>
                      {/* Main letter with gradient */}
                      <span className="relative text-3xl font-black bg-gradient-to-br from-white via-blue-200 to-purple-200 bg-clip-text text-transparent filter drop-shadow-lg">
                        K
                      </span>
                      {/* Highlight effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent text-3xl font-black bg-clip-text text-transparent animate-pulse">
                        K
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced glow effects */}
                  <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-lg animate-pulse" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-2xl blur-md animate-glow-pulse" />
                  
                  {/* Particle effects */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                      style={{
                        top: `${20 + Math.sin(i * 0.785) * 15}%`,
                        left: `${50 + Math.cos(i * 0.785) * 15}%`,
                        animationDelay: `${i * 200}ms`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Animated title with staggered reveal */}
              <div className="overflow-hidden">
                <h1 className={`text-5xl font-light text-white mb-4 tracking-tight transform transition-all duration-1000 delay-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>
                  Custom
                  <span className={`block font-semibold bg-gradient-to-r from-slate-200 via-white to-slate-300 bg-clip-text text-transparent transform transition-all duration-1000 delay-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}>
                    Keyboards
                  </span>
                </h1>
              </div>
              
              <p className={`text-slate-400 text-lg font-light max-w-sm mx-auto leading-relaxed transform transition-all duration-1000 delay-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Design, visualize, and perfect your ideal mechanical keyboard experience
              </p>
            </div>

            {/* Feature Cards with staggered floating animation */}
            <div className="grid grid-cols-1 gap-4 mb-12 max-w-sm mx-auto">
              {[
                {
                  icon: <div className="w-5 h-3 bg-blue-400 rounded-sm opacity-80 animate-pulse" />,
                  gradient: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
                  title: "3D Visualization",
                  desc: "Real-time rendering of every component and customization",
                  delay: "delay-[900ms]"
                },
                {
                  icon: <div className="w-4 h-4 rounded-full bg-emerald-400 opacity-80 animate-pulse" />,
                  gradient: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
                  title: "Authentic Sound",
                  desc: "Experience realistic switch sounds and typing feedback",
                  delay: "delay-[1100ms]"
                },
                {
                  icon: (
                    <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                      <div className="bg-violet-400 rounded-sm opacity-80 animate-pulse" />
                      <div className="bg-violet-400 rounded-sm opacity-60 animate-pulse" />
                      <div className="bg-violet-400 rounded-sm opacity-60 animate-pulse" />
                      <div className="bg-violet-400 rounded-sm opacity-80 animate-pulse" />
                    </div>
                  ),
                  gradient: "from-violet-500/20 to-violet-600/20 border-violet-500/30",
                  title: "Premium Components",
                  desc: "Choose from curated switches, keycaps, and materials",
                  delay: "delay-[1300ms]"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group p-6 rounded-2xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm transition-all duration-700 hover:bg-slate-900/60 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transform ${feature.delay} ${
                    isLoaded ? 'opacity-100 translate-y-0 rotate-0' : `opacity-0 translate-y-12 rotate-${index * 2 + 1}`
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white text-sm mb-1 transition-colors duration-300 group-hover:text-blue-300">{feature.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed transition-colors duration-300 group-hover:text-slate-300">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Primary CTA with epic entrance */}
            <div className={`space-y-4 max-w-sm mx-auto transform transition-all duration-1000 delay-[1500ms] ${
              isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}>
              <button
                onClick={() => setCurrentPage('preferences')}
                className="relative w-full bg-white text-slate-950 font-medium py-4 px-6 rounded-2xl shadow-lg shadow-white/10 hover:shadow-white/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden group mb-3"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                <span className="relative z-10">Start Building</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('sound-test')}
                className="relative w-full bg-slate-800 text-white font-medium py-3 px-6 rounded-2xl border border-slate-600 hover:bg-slate-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                🎵 Test Keyboard Sounds (Shop Mini Ready!)
              </button>
            </div>

            {/* Trust Indicators with gentle float-in */}
            <div className={`mt-12 pt-8 border-t border-slate-800/50 transform transition-all duration-1000 delay-[1700ms] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center justify-center space-x-8 text-xs text-slate-500">
                {[
                  { color: "bg-emerald-400", text: "Free Shipping" },
                  { color: "bg-blue-400", text: "30-Day Returns" },
                  { color: "bg-violet-400", text: "2-Year Warranty" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 transition-all duration-300 hover:text-slate-300">
                    <div className={`w-1.5 h-1.5 ${item.color} rounded-full animate-pulse`} style={{ animationDelay: `${index * 200}ms` }} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Sound Test Page
  if (currentPage === 'sound-test') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
        <div className="pt-4 px-4 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('welcome')}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-white">Sound Test</h1>
                <p className="text-slate-400 text-sm">Experience different keyboard switch sounds</p>
              </div>
            </div>
          </div>

          {/* Sound Demo Component */}
          <ShopifyKeyboardSounds />
        </div>
      </div>
    )
  }

  // Preferences Page - No 3D Preview, Just Preference Selection
  if (currentPage === 'preferences') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
        <div className="pt-4 px-4 pb-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('welcome')}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-white">Preferences</h1>
                <p className="text-slate-400 text-sm">Tell us your preferences for personalized recommendations</p>
              </div>
            </div>
          </div>

          {/* Configuration Sections */}
          <div className="space-y-6">
            {/* Layout Selection */}
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Preferred Layout</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'tkl', name: 'TKL', desc: '87 keys' },
                  { id: '60', name: '60%', desc: '61 keys' },
                  { id: 'full', name: 'Full', desc: '104 keys' },
                ].map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => setKeyboardConfig(prev => ({ ...prev, layout: layout.id as any }))}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      keyboardConfig.layout === layout.id
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-slate-900/40 border-slate-700/50 text-slate-300 hover:bg-slate-900/60 hover:border-slate-600/50'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">{layout.name}</div>
                    <div className="text-xs opacity-70">{layout.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Switch Type */}
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Switch Type Preference</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'linear', name: 'Linear', desc: 'Smooth & Fast', color: 'from-red-500/30 to-red-600/30 border-red-500/40' },
                  { id: 'tactile', name: 'Tactile', desc: 'Bumpy Feel', color: 'from-amber-500/30 to-amber-600/30 border-amber-500/40' },
                  { id: 'clicky', name: 'Clicky', desc: 'Audible Click', color: 'from-blue-500/30 to-blue-600/30 border-blue-500/40' },
                ].map((switch_) => (
                  <button
                    key={switch_.id}
                    onClick={() => setKeyboardConfig(prev => ({ ...prev, switches: switch_.id as any }))}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      keyboardConfig.switches === switch_.id
                        ? `bg-gradient-to-br ${switch_.color} text-white`
                        : 'bg-slate-900/40 border-slate-700/50 text-slate-300 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">{switch_.name}</div>
                    <div className="text-xs opacity-70">{switch_.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Case Material */}
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Case Material Preference</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'aluminum', name: 'Aluminum', desc: 'Premium & Durable' },
                  { id: 'plastic', name: 'Plastic', desc: 'Lightweight' },
                  { id: 'wood', name: 'Wood', desc: 'Natural & Warm' },
                  { id: 'carbon', name: 'Carbon Fiber', desc: 'Ultra Premium' },
                ].map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setKeyboardConfig(prev => ({ ...prev, case: material.id as any }))}
                    className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                      keyboardConfig.case === material.id
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-slate-900/40 border-slate-700/50 text-slate-300 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">{material.name}</div>
                    <div className="text-xs opacity-70">{material.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Keycap Profile */}
            <div>
              <h2 className="text-lg font-medium text-white mb-4">Keycap Profile</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'cherry', name: 'Cherry', desc: 'Low profile, comfortable' },
                  { id: 'oem', name: 'OEM', desc: 'Standard height' },
                  { id: 'sa', name: 'SA', desc: 'High profile, sculpted' },
                  { id: 'xda', name: 'XDA', desc: 'Uniform, flat' },
                ].map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => setKeyboardConfig(prev => ({ ...prev, keycaps: profile.id as any }))}
                    className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                      keyboardConfig.keycaps === profile.id
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'bg-slate-900/40 border-slate-700/50 text-slate-300 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">{profile.name}</div>
                    <div className="text-xs opacity-70">{profile.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fixed Bottom Actions */}
          <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800/50 p-4">
            <div className="flex space-x-3">
              <button 
                onClick={() => setCurrentPage('welcome')}
                className="flex-1 bg-slate-900/60 border border-slate-700/50 text-slate-300 font-medium py-3 px-4 rounded-xl hover:bg-slate-900/80 transition-all duration-200"
              >
                Back
              </button>
              <button 
                onClick={() => setCurrentPage('builder')}
                className="flex-1 bg-white text-slate-950 font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                See Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Expanded Floating View - Separated Keyboard Components
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
      <div className="pt-4 px-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('preferences')}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">Keyboard Builder</h1>
              <p className="text-slate-400 text-sm">Exploded view of your custom keyboard</p>
            </div>
          </div>
          
          <button className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10m-5 5a1 1 0 100 2 1 1 0 000-2zm5 0a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
          </button>
        </div>

        {/* 3D Exploded View - Integration with KeySim */}
        <div className="mb-8 h-80 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
          {/* Floating Keycaps */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 animate-float">
            <div className="relative">
              <div className="w-40 h-8 bg-gradient-to-br from-slate-300 to-slate-500 rounded-lg shadow-2xl transform perspective-1000 rotateX-15 hover:rotateX-5 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg" />
                <div className="absolute inset-x-2 inset-y-1 grid grid-cols-10 gap-0.5">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-white/30 rounded-sm" />
                  ))}
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Keycaps
              </div>
            </div>
          </div>

          {/* Floating Switches */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="relative">
              <div className="w-36 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md shadow-xl transform perspective-1000 rotateX-10 hover:rotateX-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-md" />
                <div className="absolute inset-x-2 inset-y-1 grid grid-cols-8 gap-0.5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white/40 rounded-xs" />
                  ))}
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Switches
              </div>
            </div>
          </div>

          {/* Floating Case */}
          <div className="absolute top-44 left-1/2 transform -translate-x-1/2 animate-float" style={{ animationDelay: '1s' }}>
            <div className="relative">
              <div className="w-44 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl shadow-2xl transform perspective-1000 rotateX-5 hover:rotateX-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
                <div className="absolute inset-2 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-lg" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-slate-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Case
              </div>
            </div>
          </div>

          {/* Assembly Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="assemblyLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                <stop offset="50%" stopColor="rgba(99, 102, 241, 0.5)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
              </linearGradient>
            </defs>
            <line x1="50%" y1="20%" x2="50%" y2="35%" stroke="url(#assemblyLine)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
            <line x1="50%" y1="40%" x2="50%" y2="55%" stroke="url(#assemblyLine)" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          </svg>

          {/* Background particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 300}ms`,
                animationDuration: `${2000 + i * 200}ms`
              }}
            />
          ))}

          {/* Integration placeholder */}
          <div className="absolute bottom-4 left-4 text-slate-500 text-xs">
            KeySim 3D Integration Ready
          </div>
        </div>

        {/* Component Details */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="text-white font-medium text-sm">Keycaps</h3>
              </div>
              <p className="text-slate-400 text-xs">{keyboardConfig.keycaps.toUpperCase()} Profile</p>
              <p className="text-slate-500 text-xs mt-1">Premium quality</p>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <h3 className="text-white font-medium text-sm">Switches</h3>
              </div>
              <p className="text-slate-400 text-xs">{keyboardConfig.switches} Type</p>
              <p className="text-slate-500 text-xs mt-1">Optimized feel</p>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                <h3 className="text-white font-medium text-sm">Case</h3>
              </div>
              <p className="text-slate-400 text-xs">{keyboardConfig.case} Material</p>
              <p className="text-slate-500 text-xs mt-1">Durable build</p>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800/50 p-4">
          <div className="flex space-x-3">
            <button className="flex-1 bg-slate-900/60 border border-slate-700/50 text-slate-300 font-medium py-3 px-4 rounded-xl hover:bg-slate-900/80 transition-all duration-200">
              Customize Parts
            </button>
            <button className="flex-1 bg-white text-slate-950 font-medium py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200">
              Add to Cart - $399
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
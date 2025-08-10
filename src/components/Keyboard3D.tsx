import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox, Sphere, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface KeyboardConfig {
  layout: string
  switches: string
  keycaps: string
  case: string
}

interface Keyboard3DProps {
  config: KeyboardConfig
  exploded?: boolean
}

// KeySim-inspired layout generator with proper QMK-style layouts
function generateKeyboardLayout(layout: string) {
  const layouts = {
    'tkl': {
      name: 'TKL (87-key)',
      width: 18.25,
      height: 6.5,
      keyCount: 87,
      keys: [
        // Function row
        { x: 0, y: 0, width: 1, height: 1, legend: 'Esc' },
        { x: 2, y: 0, width: 1, height: 1, legend: 'F1' },
        { x: 3, y: 0, width: 1, height: 1, legend: 'F2' },
        { x: 4, y: 0, width: 1, height: 1, legend: 'F3' },
        { x: 5, y: 0, width: 1, height: 1, legend: 'F4' },
        { x: 6.5, y: 0, width: 1, height: 1, legend: 'F5' },
        { x: 7.5, y: 0, width: 1, height: 1, legend: 'F6' },
        { x: 8.5, y: 0, width: 1, height: 1, legend: 'F7' },
        { x: 9.5, y: 0, width: 1, height: 1, legend: 'F8' },
        { x: 11, y: 0, width: 1, height: 1, legend: 'F9' },
        { x: 12, y: 0, width: 1, height: 1, legend: 'F10' },
        { x: 13, y: 0, width: 1, height: 1, legend: 'F11' },
        { x: 14, y: 0, width: 1, height: 1, legend: 'F12' },
        
        // Number row (simplified for demo)
        { x: 0, y: 1.25, width: 1, height: 1, legend: '`' },
        { x: 1, y: 1.25, width: 1, height: 1, legend: '1' },
        { x: 2, y: 1.25, width: 1, height: 1, legend: '2' },
        { x: 3, y: 1.25, width: 1, height: 1, legend: '3' },
        { x: 4, y: 1.25, width: 1, height: 1, legend: '4' },
        { x: 5, y: 1.25, width: 1, height: 1, legend: '5' },
        { x: 6, y: 1.25, width: 1, height: 1, legend: '6' },
        { x: 7, y: 1.25, width: 1, height: 1, legend: '7' },
        { x: 8, y: 1.25, width: 1, height: 1, legend: '8' },
        { x: 9, y: 1.25, width: 1, height: 1, legend: '9' },
        { x: 10, y: 1.25, width: 1, height: 1, legend: '0' },
        { x: 13, y: 1.25, width: 2, height: 1, legend: 'Backspace' },
        
        // QWERTY row
        { x: 0, y: 2.25, width: 1.5, height: 1, legend: 'Tab' },
        { x: 1.5, y: 2.25, width: 1, height: 1, legend: 'Q' },
        { x: 2.5, y: 2.25, width: 1, height: 1, legend: 'W' },
        { x: 3.5, y: 2.25, width: 1, height: 1, legend: 'E' },
        { x: 4.5, y: 2.25, width: 1, height: 1, legend: 'R' },
        { x: 5.5, y: 2.25, width: 1, height: 1, legend: 'T' },
        { x: 6.5, y: 2.25, width: 1, height: 1, legend: 'Y' },
        { x: 7.5, y: 2.25, width: 1, height: 1, legend: 'U' },
        { x: 8.5, y: 2.25, width: 1, height: 1, legend: 'I' },
        { x: 9.5, y: 2.25, width: 1, height: 1, legend: 'O' },
        { x: 10.5, y: 2.25, width: 1, height: 1, legend: 'P' },
        
        // ASDF row
        { x: 0, y: 3.25, width: 1.75, height: 1, legend: 'Caps' },
        { x: 1.75, y: 3.25, width: 1, height: 1, legend: 'A' },
        { x: 2.75, y: 3.25, width: 1, height: 1, legend: 'S' },
        { x: 3.75, y: 3.25, width: 1, height: 1, legend: 'D' },
        { x: 4.75, y: 3.25, width: 1, height: 1, legend: 'F' },
        { x: 5.75, y: 3.25, width: 1, height: 1, legend: 'G' },
        { x: 6.75, y: 3.25, width: 1, height: 1, legend: 'H' },
        { x: 7.75, y: 3.25, width: 1, height: 1, legend: 'J' },
        { x: 8.75, y: 3.25, width: 1, height: 1, legend: 'K' },
        { x: 9.75, y: 3.25, width: 1, height: 1, legend: 'L' },
        { x: 12.75, y: 3.25, width: 2.25, height: 1, legend: 'Enter' },
        
        // ZXCV row
        { x: 0, y: 4.25, width: 2.25, height: 1, legend: 'Shift' },
        { x: 2.25, y: 4.25, width: 1, height: 1, legend: 'Z' },
        { x: 3.25, y: 4.25, width: 1, height: 1, legend: 'X' },
        { x: 4.25, y: 4.25, width: 1, height: 1, legend: 'C' },
        { x: 5.25, y: 4.25, width: 1, height: 1, legend: 'V' },
        { x: 6.25, y: 4.25, width: 1, height: 1, legend: 'B' },
        { x: 7.25, y: 4.25, width: 1, height: 1, legend: 'N' },
        { x: 8.25, y: 4.25, width: 1, height: 1, legend: 'M' },
        
        // Space row
        { x: 0, y: 5.25, width: 1.25, height: 1, legend: 'Ctrl' },
        { x: 1.25, y: 5.25, width: 1.25, height: 1, legend: 'Win' },
        { x: 2.5, y: 5.25, width: 1.25, height: 1, legend: 'Alt' },
        { x: 3.75, y: 5.25, width: 6.25, height: 1, legend: 'Space' },
        { x: 10, y: 5.25, width: 1.25, height: 1, legend: 'Alt' },
        { x: 11.25, y: 5.25, width: 1.25, height: 1, legend: 'Win' },
        { x: 12.5, y: 5.25, width: 1.25, height: 1, legend: 'Menu' },
        { x: 13.75, y: 5.25, width: 1.25, height: 1, legend: 'Ctrl' },
      ]
    },
    '60': {
      name: '60% (61-key)',
      width: 15,
      height: 5,
      keyCount: 61,
      keys: [
        // Simplified 60% layout
        { x: 0, y: 0, width: 1, height: 1, legend: '`' },
        { x: 1, y: 0, width: 1, height: 1, legend: '1' },
        { x: 2, y: 0, width: 1, height: 1, legend: '2' },
        { x: 3, y: 0, width: 1, height: 1, legend: '3' },
        { x: 4, y: 0, width: 1, height: 1, legend: '4' },
        { x: 5, y: 0, width: 1, height: 1, legend: '5' },
        { x: 6, y: 0, width: 1, height: 1, legend: '6' },
        { x: 7, y: 0, width: 1, height: 1, legend: '7' },
        { x: 8, y: 0, width: 1, height: 1, legend: '8' },
        { x: 9, y: 0, width: 1, height: 1, legend: '9' },
        { x: 10, y: 0, width: 1, height: 1, legend: '0' },
        { x: 13, y: 0, width: 2, height: 1, legend: 'Backspace' },
        
        { x: 0, y: 1, width: 1.5, height: 1, legend: 'Tab' },
        { x: 1.5, y: 1, width: 1, height: 1, legend: 'Q' },
        { x: 2.5, y: 1, width: 1, height: 1, legend: 'W' },
        { x: 3.5, y: 1, width: 1, height: 1, legend: 'E' },
        { x: 4.5, y: 1, width: 1, height: 1, legend: 'R' },
        { x: 5.5, y: 1, width: 1, height: 1, legend: 'T' },
        { x: 6.5, y: 1, width: 1, height: 1, legend: 'Y' },
        { x: 7.5, y: 1, width: 1, height: 1, legend: 'U' },
        { x: 8.5, y: 1, width: 1, height: 1, legend: 'I' },
        { x: 9.5, y: 1, width: 1, height: 1, legend: 'O' },
        { x: 10.5, y: 1, width: 1, height: 1, legend: 'P' },
        
        { x: 0, y: 2, width: 1.75, height: 1, legend: 'Caps' },
        { x: 1.75, y: 2, width: 1, height: 1, legend: 'A' },
        { x: 2.75, y: 2, width: 1, height: 1, legend: 'S' },
        { x: 3.75, y: 2, width: 1, height: 1, legend: 'D' },
        { x: 4.75, y: 2, width: 1, height: 1, legend: 'F' },
        { x: 5.75, y: 2, width: 1, height: 1, legend: 'G' },
        { x: 6.75, y: 2, width: 1, height: 1, legend: 'H' },
        { x: 7.75, y: 2, width: 1, height: 1, legend: 'J' },
        { x: 8.75, y: 2, width: 1, height: 1, legend: 'K' },
        { x: 9.75, y: 2, width: 1, height: 1, legend: 'L' },
        { x: 12.75, y: 2, width: 2.25, height: 1, legend: 'Enter' },
        
        { x: 0, y: 3, width: 2.25, height: 1, legend: 'Shift' },
        { x: 2.25, y: 3, width: 1, height: 1, legend: 'Z' },
        { x: 3.25, y: 3, width: 1, height: 1, legend: 'X' },
        { x: 4.25, y: 3, width: 1, height: 1, legend: 'C' },
        { x: 5.25, y: 3, width: 1, height: 1, legend: 'V' },
        { x: 6.25, y: 3, width: 1, height: 1, legend: 'B' },
        { x: 7.25, y: 3, width: 1, height: 1, legend: 'N' },
        { x: 8.25, y: 3, width: 1, height: 1, legend: 'M' },
        
        { x: 0, y: 4, width: 1.25, height: 1, legend: 'Ctrl' },
        { x: 1.25, y: 4, width: 1.25, height: 1, legend: 'Win' },
        { x: 2.5, y: 4, width: 1.25, height: 1, legend: 'Alt' },
        { x: 3.75, y: 4, width: 6.25, height: 1, legend: 'Space' },
        { x: 10, y: 4, width: 1.25, height: 1, legend: 'Alt' },
        { x: 11.25, y: 4, width: 1.25, height: 1, legend: 'Win' },
        { x: 12.5, y: 4, width: 1.25, height: 1, legend: 'Menu' },
        { x: 13.75, y: 4, width: 1.25, height: 1, legend: 'Ctrl' },
      ]
    }
  }
  
  return layouts[layout as keyof typeof layouts] || layouts.tkl
}

// 3D Keycap Component using Three.js 0.125.2 API
function Keycap3D({ 
  position, 
  size, 
  profile, 
  material, 
  legend, 
  exploded,
  index 
}: {
  position: [number, number, number]
  size: [number, number]
  profile: string
  material: string
  legend: string
  exploded: boolean
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Material colors based on keycap material
  const keycapColor = useMemo(() => {
    const colors = {
      'white': '#f8f9fa',
      'black': '#212529', 
      'purple': '#8b5cf6',
      'cherry': '#e9ecef',
      'oem': '#f1f3f4',
      'sa': '#ffffff',
      'xda': '#f8f9fa'
    }
    
    return colors[material as keyof typeof colors] || colors.white
  }, [material])

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      const time = state.clock.elapsedTime
      const floatOffset = Math.sin(time * 1.5 + index * 0.1) * 0.02
      
      if (exploded) {
        meshRef.current.position.y = position[1] + floatOffset
        meshRef.current.rotation.x = Math.sin(time * 0.5 + index * 0.2) * 0.05
        meshRef.current.rotation.z = Math.cos(time * 0.7 + index * 0.15) * 0.03
      } else {
        meshRef.current.position.y = position[1] + floatOffset
      }
      
      // Hover effect
      if (hovered) {
        meshRef.current.scale.setScalar(1.05)
      } else {
        meshRef.current.scale.setScalar(1.0)
      }
    }
  })

  // Use RoundedBox for KeySim-style keycaps
  const keycapHeight = profile === 'sa' ? 0.5 : profile === 'cherry' ? 0.35 : 0.4

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[size[0] * 0.95, keycapHeight, size[1] * 0.95]}
        radius={0.05}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={keycapColor}
          roughness={0.3}
          metalness={0.1}
        />
      </RoundedBox>
      
      {/* Key legend */}
      {legend && legend.length <= 4 && (
        <Text
          position={[0, exploded ? keycapHeight/2 + 0.05 : keycapHeight/2 + 0.05, 0]}
          fontSize={0.15}
          color={material === 'black' ? '#ffffff' : '#333333'}
          anchorX="center"
          anchorY="middle"
        >
          {legend}
        </Text>
      )}
    </group>
  )
}

// 3D Switch Component with GLB model and fallback
function Switch3D({ 
  position, 
  switchType, 
  exploded,
  index 
}: {
  position: [number, number, number]
  switchType: string
  exploded: boolean
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [useGLTFModel, setUseGLTFModel] = useState(true)

  // Switch colors based on type (KeySim inspired)
  const switchColors = {
    'linear': '#ef4444',    // Red for linear
    'tactile': '#f59e0b',   // Amber for tactile  
    'clicky': '#3b82f6'     // Blue for clicky
  }

  const switchColor = switchColors[switchType as keyof typeof switchColors] || '#6b7280'

  // Try to load GLB model with error handling
  let glbContent = null
  try {
    if (useGLTFModel) {
      const { scene } = useGLTF('/cherry_mx_switches.glb')
      glbContent = useMemo(() => {
        const clonedScene = scene.clone()
        clonedScene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const material = child.material as THREE.MeshStandardMaterial
            material.color = new THREE.Color(switchColor)
            material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        return clonedScene
      }, [scene, switchColor])
    }
  } catch (error) {
    console.warn('Failed to load GLB model, using fallback:', error)
    setUseGLTFModel(false)
  }

  useFrame((state) => {
    const targetRef = groupRef.current || meshRef.current
    if (targetRef) {
      const time = state.clock.elapsedTime
      const floatOffset = Math.sin(time * 1.2 + index * 0.15) * 0.015
      
      if (exploded) {
        targetRef.position.y = position[1] + floatOffset
        targetRef.rotation.x = Math.sin(time * 0.5 + index * 0.2) * 0.02
        targetRef.rotation.z = Math.cos(time * 0.7 + index * 0.15) * 0.01
      } else {
        targetRef.position.y = position[1] + floatOffset - 0.2
      }
    }
  })

  // Render GLB model if loaded successfully, otherwise use fallback geometry
  if (useGLTFModel && glbContent) {
    return (
      <group ref={groupRef} position={position}>
        <primitive 
          object={glbContent} 
          scale={[0.8, 0.8, 0.8]} 
          rotation={[0, 0, 0]} 
        />
      </group>
    )
  }

  // Enhanced realistic switch geometry fallback (Cherry MX inspired)
  return (
    <group position={position}>
      {/* Main switch housing */}
      <RoundedBox
        ref={meshRef}
        args={[0.6, 0.45, 0.6]}
        radius={0.04}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#1a202c"
          roughness={0.3}
          metalness={0.7}
        />
      </RoundedBox>
      
      {/* Switch top housing */}
      <RoundedBox
        args={[0.55, 0.15, 0.55]}
        radius={0.03}
        position={[0, 0.3, 0]}
        castShadow
      >
        <meshStandardMaterial 
          color="#2d3748"
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>
      
      {/* Switch stem (colored by type) */}
      <RoundedBox
        args={[0.18, 0.35, 0.18]}
        radius={0.02}
        position={[0, exploded ? 0.5 : 0.25, 0]}
        castShadow
      >
        <meshStandardMaterial 
          color={switchColor}
          roughness={0.1}
          metalness={0.4}
        />
      </RoundedBox>
      
      {/* Cross-shaped stem top */}
      <RoundedBox
        args={[0.22, 0.08, 0.06]}
        radius={0.01}
        position={[0, exploded ? 0.6 : 0.35, 0]}
        castShadow
      >
        <meshStandardMaterial color={switchColor} roughness={0.1} metalness={0.4} />
      </RoundedBox>
      <RoundedBox
        args={[0.06, 0.08, 0.22]}
        radius={0.01}
        position={[0, exploded ? 0.6 : 0.35, 0]}
        castShadow
      >
        <meshStandardMaterial color={switchColor} roughness={0.1} metalness={0.4} />
      </RoundedBox>
      
      {/* Switch pins */}
      <Sphere args={[0.02]} position={[-0.15, exploded ? -0.2 : -0.3, 0.1]}>
        <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.05} />
      </Sphere>
      <Sphere args={[0.02]} position={[0.15, exploded ? -0.2 : -0.3, 0.1]}>
        <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.05} />
      </Sphere>
      
      {/* LED slot (optional detail) */}
      <RoundedBox
        args={[0.1, 0.05, 0.1]}
        radius={0.01}
        position={[0, -0.1, 0.25]}
      >
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
      </RoundedBox>
    </group>
  )
}

// 3D Keyboard Case Component
function KeyboardCase3D({ 
  layout, 
  material, 
  exploded 
}: {
  layout: ReturnType<typeof generateKeyboardLayout>
  material: string
  exploded: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Case materials (KeySim inspired)
  const caseMaterials = {
    'aluminum': { color: '#64748b', metalness: 0.9, roughness: 0.1 },
    'plastic': { color: '#374151', metalness: 0.1, roughness: 0.6 },
    'wood': { color: '#92400e', metalness: 0.0, roughness: 0.8 },
    'carbon': { color: '#111827', metalness: 0.3, roughness: 0.2 }
  }

  const mat = caseMaterials[material as keyof typeof caseMaterials] || caseMaterials.aluminum

  useFrame((state) => {
    if (meshRef.current && exploded) {
      const time = state.clock.elapsedTime
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.1
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.02
    }
  })

  return (
    <group position={exploded ? [0, 0, 0] : [0, -0.5, 0]}>
      {/* Main case body */}
      <RoundedBox
        ref={meshRef}
        args={[layout.width + 1, 0.8, layout.height + 1]}
        radius={0.3}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={mat.color}
          metalness={mat.metalness}
          roughness={mat.roughness}
        />
      </RoundedBox>
      
      {/* Case interior */}
      <RoundedBox
        args={[layout.width - 0.2, 0.6, layout.height - 0.2]}
        radius={0.2}
        position={[0, 0.1, 0]}
      >
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.8}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Case feet */}
      {[
        [-layout.width/2 + 1, -layout.height/2 + 1],
        [layout.width/2 - 1, -layout.height/2 + 1],
        [-layout.width/2 + 1, layout.height/2 - 1],
        [layout.width/2 - 1, layout.height/2 - 1]
      ].map((pos, i) => (
        <RoundedBox key={i} args={[0.3, 0.1, 0.3]} position={[pos[0], -0.5, pos[1]]}>
          <meshStandardMaterial color="#2a2a2a" />
        </RoundedBox>
      ))}
    </group>
  )
}

// Assembly Guide Lines (KeySim inspired)
function AssemblyGuides({ exploded, layout }: { exploded: boolean, layout: ReturnType<typeof generateKeyboardLayout> }) {
  if (!exploded) return null

  return (
    <group>
      {/* Vertical connection lines for first few keys */}
      {layout.keys.slice(0, 6).map((key, index) => (
        <mesh key={`guide-${index}`} position={[key.x - layout.width/2, 1.5, -(key.y - layout.height/2)]}>
          <cylinderGeometry args={[0.002, 0.002, 4.5]} />
          <meshBasicMaterial 
            color="#60a5fa" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      ))}
      
      {/* Floating assembly points */}
      {[...Array(8)].map((_, i) => (
        <Sphere
          key={`point-${i}`}
          args={[0.02]}
          position={[
            (Math.random() - 0.5) * layout.width,
            1 + Math.random() * 2,
            (Math.random() - 0.5) * layout.height
          ]}
        >
          <meshBasicMaterial 
            color="#60a5fa" 
            transparent 
            opacity={0.8}
          />
        </Sphere>
      ))}
    </group>
  )
}

// Main 3D Keyboard Component (KeySim architecture)
export function Keyboard3D({ config, exploded = false }: Keyboard3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const layout = useMemo(() => generateKeyboardLayout(config.layout), [config.layout])
  
  // Smooth camera animation (KeySim style)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Layer 1: Keyboard Case (Bottom) */}
      <KeyboardCase3D 
        layout={layout} 
        material={config.case} 
        exploded={exploded}
      />
      
      {/* Layer 2: Switches (Middle) */}
      {layout.keys.map((key, index) => (
        <Switch3D
          key={`switch-${index}`}
          position={[
            key.x - layout.width/2, 
            exploded ? 2.5 : -0.2, 
            -(key.y - layout.height/2)
          ]}
          switchType={config.switches}
          exploded={exploded}
          index={index}
        />
      ))}
      
      {/* Layer 3: Keycaps (Top) */}
      {layout.keys.map((key, index) => (
        <Keycap3D
          key={`keycap-${index}`}
          position={[
            key.x - layout.width/2, 
            exploded ? 5.0 : 0.2, 
            -(key.y - layout.height/2)
          ]}
          size={[key.width, key.height]}
          profile={config.keycaps}
          material={config.keycaps}
          legend={key.legend}
          exploded={exploded}
          index={index}
        />
      ))}
      
      {/* Simplified assembly guides for 3 layers */}
      <AssemblyGuides exploded={exploded} layout={layout} />
    </group>
  )
}

// Preload the GLB model for better performance
useGLTF.preload('/cherry_mx_switches.glb')
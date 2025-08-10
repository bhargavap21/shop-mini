// Redux-to-React State Adapter for Keysim
// This replaces Redux with React state management

class StateAdapter {
  constructor() {
    this.state = {
      case: {
        layout: '60',
        style: 'CASE_1',
        primaryColor: '#333333',
        material: 'matte'
      },
      colorways: {
        active: 'wob',
        editing: false,
        activeSwatch: 'base',
        custom: {}
      },
      keys: {
        legendPrimaryStyle: 'CENTER',
        legendSecondaryStyle: 'BOTTOM_LEFT',
        profile: 'CHERRY',
        material: 'ABS'
      },
      settings: {
        paintWithKeys: false,
        sceneAutoColor: true,
        sceneColor: '#222222',
        activeWindowColor: '#000000'
      }
    }
    this.subscribers = {}
    this.callbacks = {}
  }

  // Redux-style subscribe function
  subscribe(path, callback) {
    if (!this.callbacks[path]) {
      this.callbacks[path] = []
    }
    this.callbacks[path].push(callback)
    
    // Return unsubscribe function
    return () => {
      this.callbacks[path] = this.callbacks[path].filter(cb => cb !== callback)
    }
  }

  // Update state and notify subscribers
  setState(updates) {
    const oldState = { ...this.state }
    
    // Deep merge updates
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
        this.state[key] = { ...this.state[key], ...updates[key] }
      } else {
        this.state[key] = updates[key]
      }
    })

    // Notify subscribers
    Object.keys(this.callbacks).forEach(path => {
      const pathParts = path.split('.')
      const newValue = this.getNestedValue(this.state, pathParts)
      const oldValue = this.getNestedValue(oldState, pathParts)
      
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        this.callbacks[path].forEach(callback => {
          callback(this.state)
        })
      }
    })
  }

  getNestedValue(obj, path) {
    return path.reduce((current, key) => current && current[key], obj)
  }

  getState() {
    return this.state
  }

  // Keysim-specific setters
  setLayout(layout) {
    this.setState({
      case: { ...this.state.case, layout }
    })
  }

  setColorway(colorway) {
    this.setState({
      colorways: { ...this.state.colorways, active: colorway }
    })
  }

  setCaseColor(color) {
    this.setState({
      case: { ...this.state.case, primaryColor: color }
    })
  }

  setCaseMaterial(material) {
    this.setState({
      case: { ...this.state.case, material }
    })
  }

  setEditing(editing) {
    this.setState({
      colorways: { ...this.state.colorways, editing }
    })
  }
}

// Global instance
export const stateAdapter = new StateAdapter()

// Redux compatibility functions
export const subscribe = (path, callback) => stateAdapter.subscribe(path, callback)
export const getState = () => stateAdapter.getState()

// Initial settings compatible with Keysim
export const initial_settings = {
  case: {
    layout: '60',
    style: 'CASE_1', 
    primaryColor: '#333333',
    material: 'matte'
  },
  colorways: {
    active: 'wob',
    activeSwatch: 'base',
    editing: false,
    custom: {}
  },
  keys: {
    legendPrimaryStyle: 'CENTER',
    legendSecondaryStyle: 'BOTTOM_LEFT',
    profile: 'CHERRY',
    material: 'ABS'
  },
  settings: {
    paintWithKeys: false,
    sceneAutoColor: true,
    sceneColor: '#222222',
    activeWindowColor: '#000000'
  }
}

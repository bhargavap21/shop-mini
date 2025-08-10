import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import './keysim-safe.css'
import {MinisContainer} from '@shopify/shop-minis-react'
import '@fontsource/orbitron/400.css'
import '@fontsource/orbitron/700.css'
import '@fontsource/orbitron/900.css'
import '@fontsource/space-grotesk/300.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'

import {App} from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MinisContainer>
      <App />
    </MinisContainer>
  </StrictMode>
)

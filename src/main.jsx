import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GameContextProvider } from './provider/context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameContextProvider>
    <App />
    </GameContextProvider>
  </StrictMode>,
)

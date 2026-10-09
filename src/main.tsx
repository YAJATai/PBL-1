import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/App'
import { AppProvider } from '@/store/AppContext'
import { Toaster } from '@/components/ui/Toaster'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
        <Toaster />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)

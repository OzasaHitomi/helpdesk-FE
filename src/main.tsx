import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ChakraUIProvider } from '@/components/ui/provider'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraUIProvider>
        <App />
      </ChakraUIProvider>
    </BrowserRouter>
  </StrictMode>,
)

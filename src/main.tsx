import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ChakraUIProvider } from '@/components/ui/provider'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraUIProvider>
      <App />
    </ChakraUIProvider>
  </StrictMode>,
)

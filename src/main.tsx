import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ChakraUIProvider } from '@/components/ui/provider'
import App from './App.tsx'

// viteが作成したものなので強制的にエラーにしないようにする
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraUIProvider>
        <App />
      </ChakraUIProvider>
    </BrowserRouter>
  </StrictMode>,
)

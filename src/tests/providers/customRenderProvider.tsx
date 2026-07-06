import { Provider as ChakraUIProvider } from '@/components/ui/provider.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { createTestQueryClient } from '../config/testQueryClient'
import type { ReactNode } from 'react'

interface CustomRenderProviderProps {
  children: ReactNode
}

export const CustomRenderProvider = ({ children }: CustomRenderProviderProps) => {
  return (
    <ChakraUIProvider>
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    </ChakraUIProvider>
  )
}

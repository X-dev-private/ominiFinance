import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { projectId, metadata, networks, wagmiAdapter } from '../config'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'

import Actives from './activespage'
import Home from './home'
import LiquidityPage from './liquidyPage'
import SwapPage from './swappage'

import "../App.css"
import PortifolioPage from './portifolioPage'

const queryClient = new QueryClient()

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'light' as const,
  themeVariables: {
    '--w3m-accent': '#000000',
  }
}

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

// Definição das rotas
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/app",
    element: <Actives />
  },
  {
    path: "/app/swap",
    element: <SwapPage />
  },{
    path: "/app/liquidity",
    element: <LiquidityPage />
  },{
    path: "/app/portifolio",
    element: <PortifolioPage />
  }

])

export default function App() {
  return (
    <div className="pages">
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  )
}

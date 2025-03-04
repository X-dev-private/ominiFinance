import React from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { projectId, metadata, networks, wagmiAdapter } from './config';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NetworkColorProvider } from './config/networkColorContext';  // Importando o contexto
import Actives from './pages/activespage';
import Home from './pages/home';
import LiquidityPage from './pages/liquidyPage';
import SwapPage from './pages/swappage';
import PortifolioPage from './pages/portifolioPage';
import "./App.css";
import DebridgeExample from './pages/bridge';

const queryClient = new QueryClient();

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'light' as const,
  themeVariables: {
    '--w3m-accent': '#000000',
  },
};

createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

// Definindo as rotas
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/app",
    element: <Actives />,
  },
  {
    path: "/app/liquidity",
    element: <LiquidityPage />,
  },{
    path: "/app/swap",
    element: <SwapPage />,
  },
  {
    path: "/app/portifolio",
    element: <PortifolioPage />,
  },
]);

const App: React.FC = () => {
  return (
    <div className="pages">
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <NetworkColorProvider> 
          <SpeedInsights />
            <RouterProvider router={router} />
          </NetworkColorProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
};

export default App;

import React from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { projectId, metadata, networks, wagmiAdapter } from '../config';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NetworkColorProvider } from '../config/networkColorContext';  // Importando o contexto
import Actives from './activespage';
import Home from './home';
import LiquidityPage from './liquidyPage';
import SwapPage from './swappage';
import PortifolioPage from './portifolioPage';

import "../App.css";
import DebridgeExample from './bridge';

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
  },/*{
    path: "/app/bridge",
    element: <DebridgeExample />,
  },*/
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
          <NetworkColorProvider>  {/* Envolvendo com o NetworkColorProvider */}
            <RouterProvider router={router} />
          </NetworkColorProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
};

export default App;

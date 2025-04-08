import React from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { projectId, metadata, networks, wagmiAdapter } from './config';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NetworkColorProvider } from './config/networkColorContext';
import { MoonPayProvider } from '@moonpay/moonpay-react';

import Actives from './pages/activespage';
import Home from './pages/home';
import LiquidityPage from './pages/liquidyPage';
import SwapPage from './pages/swappage';
import PortifolioPage from './pages/portifolioPage';
import "./App.css";
import DebridgeExample from './pages/bridge';
import RoadMapPage from './pages/roadmap';
import { SeiWalletProvider } from '@sei-js/react';
import CreateTokenPage from './pages/createTokenPage';
import MyTokensPage from './pages/myTokensPage';
import TokenConfigPage from './pages/tokensConfigPage';
import CreatePool from './pages/createPool';
import Ramp from './pages/Ramp';

const COSMOS_CONFIG = {
  chainId: 'cosmoshub-4',
  restUrl: 'https://lcd-cosmoshub.keplr.app',
  rpcUrl: 'https://rpc-cosmoshub.keplr.app'
};

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

const KEPLR_WALLET = {
  getAccounts: async (chainId: string) => {
    const offlineSigner = await window.keplr?.getOfflineSignerAuto(chainId);
    return offlineSigner?.getAccounts() || [];
  },
  connect: async (chainId: string) => await window.keplr?.enable(chainId),
  disconnect: async () => await window.keplr?.disconnect(),
  getOfflineSigner: (chainId: string) => window.keplr?.getOfflineSignerAuto(chainId),
  walletInfo: {
    windowKey: 'keplr',
    name: 'Keplr',
    icon: 'https://assets.keplr.app/logo.png'
  }
};

// Definindo as rotas
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/roadmap",
    element: <RoadMapPage />,
  },
  {
    path: "/app/Dashboard",
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
    path: "/app/portfolio",
    element: <PortifolioPage />,
  },{
    path: "/app/create-token",
    element: <CreateTokenPage />,
  },{
    path: "/app/my-tokens",
    element: <MyTokensPage />,
  },{
    path: "/app/TokenConfig",
    element: <TokenConfigPage />,
  },{
    path: "/app/create-pool",
    element: <CreatePool />,
  },
  {
    path: "/app/ramp",
    element: <Ramp />,
  },
]);

const App: React.FC = () => {
  return (
    <div className="pages">
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <SeiWalletProvider 
          chainConfiguration={COSMOS_CONFIG}
          wallets={[KEPLR_WALLET]}
          autoconnect={false}
        >
        <QueryClientProvider client={queryClient}>
        <MoonPayProvider
            apiKey="pk_test_3aE0ajRGrcEkEyiRB1nb7ethJViOfVs"
            debug
        >
          <NetworkColorProvider> 
          <SpeedInsights />
            <RouterProvider router={router} />
          </NetworkColorProvider>
          </MoonPayProvider>
        </QueryClientProvider>
        </SeiWalletProvider>
      </WagmiProvider>
    </div>
  );
};

export default App;

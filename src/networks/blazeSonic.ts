import { defineChain } from "@reown/appkit/networks";

export const sonicBlazeTestnet = /*#__PURE__*/ defineChain({
  id: 57_054,
  name: 'Sonic Blaze Testnet',
  nativeCurrency: { name: 'Sonic Blaze Token', symbol: 'S', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.blaze.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'SonicScan',
      url: 'https://testnet.sonicscan.org',
      apiUrl: 'https://testnet.sonicscan.org/api',
    },
  },
  contracts: {
    // Adicione os contratos específicos da testnet se houver
  },
  testnet: true,
})

import { defineChain } from "@reown/appkit/networks";

export const luksoTestnet = /*#__PURE__*/ defineChain({
  id: 4_201, // Chain ID 4201
  name: 'LUKSO Testnet',
  nativeCurrency: { 
    name: 'LUKSO', 
    symbol: 'LYXt', // Símbolo oficial
    decimals: 18 
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.lukso.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Lukso Explorer',
      url: 'https://explorer.execution.testnet.lukso.network/',
      // API URL pode ser adicionada posteriormente se disponível
    },
  },
  contracts: {
    // Adicione contratos específicos da LUKSO quando necessário
  },
  testnet: true, // Explicitamente marca como testnet
})
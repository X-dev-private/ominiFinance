// src/services/assetsService.ts

export interface Balance {
  denom: string;
  amount: string;
}

export interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  chain: string;
  highlight?: boolean;
}

export interface CryptoPriceData {
  usd: number;
  usd_24h_change: number;
}

// Top 10 tokens Cosmos mais utilizados
const CORE_TOKENS: TokenInfo[] = [
  {
    id: 'cosmos',
    name: 'Cosmos Hub',
    symbol: 'ATOM',
    icon: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png?1555657960',
    chain: 'cosmoshub-4',
    highlight: true
  },
  {
    id: 'neutron-3',
    name: 'Neutron',
    symbol: 'NTRN',
    icon: 'https://assets.coingecko.com/coins/images/28641/large/neutron.png?1696527226',
    chain: 'neutron-1',
    highlight: true
  },
  {
    id: 'osmosis',
    name: 'Osmosis',
    symbol: 'OSMO',
    icon: 'https://assets.coingecko.com/coins/images/16724/large/osmo.png?1632763885',
    chain: 'osmosis-1',
    highlight: false
  },
  {
    id: 'injective-protocol',
    name: 'Injective',
    symbol: 'INJ',
    icon: 'https://assets.coingecko.com/coins/images/12882/large/injective_logo.jpg?1603255762',
    chain: 'injective-1',
    highlight: false
  },
  {
    id: 'thorchain',
    name: 'THORChain',
    symbol: 'RUNE',
    icon: 'https://assets.coingecko.com/coins/images/6595/large/RUNE.png?1614160507',
    chain: 'thorchain-mainnet-v1',
    highlight: false
  },
  {
    id: 'kava',
    name: 'Kava',
    symbol: 'KAVA',
    icon: 'https://assets.coingecko.com/coins/images/9761/large/kava.png?1663638871',
    chain: 'kava_2222-10',
    highlight: false
  },
  {
    id: 'fetch-ai',
    name: 'Fetch.ai',
    symbol: 'FET',
    icon: 'https://assets.coingecko.com/coins/images/5681/large/Fetch.jpg?1622079613',
    chain: 'fetchhub-4',
    highlight: false
  },
  {
    id: 'secret',
    name: 'Secret Network',
    symbol: 'SCRT',
    icon: 'https://assets.coingecko.com/coins/images/11871/large/Secret.png?1595520186',
    chain: 'secret-4',
    highlight: false
  },
  {
    id: 'akash-network',
    name: 'Akash Network',
    symbol: 'AKT',
    icon: 'https://assets.coingecko.com/coins/images/12785/large/akash-logo.png?1625447679',
    chain: 'akashnet-2',
    highlight: false
  },
  {
    id: 'persistence',
    name: 'Persistence',
    symbol: 'XPRT',
    icon: 'https://assets.coingecko.com/coins/images/13827/large/persistence_logo.png?1612178319',
    chain: 'core-1',
    highlight: false
  },
  {
    id: 'axelar',
    name: 'Axelar',
    symbol: 'AXL',
    icon: 'https://assets.coingecko.com/coins/images/24456/large/axelar.png?1663015140',
    chain: 'axelar-dojo-1',
    highlight: false
  }
];

// Chains suportadas (apenas Cosmos)
export const SUPPORTED_CHAINS = [
  { id: "cosmoshub-4", name: "Cosmos Hub", rpc: "https://rpc.cosmos.network" },
  { id: "neutron-1", name: "Neutron", rpc: "https://neutron-rpc.publicnode.com" },
  { id: "osmosis-1", name: "Osmosis", rpc: "https://rpc.osmosis.zone" },
  { id: "injective-1", name: "Injective", rpc: "https://rpc.injective.network" },
  { id: "thorchain-mainnet-v1", name: "THORChain", rpc: "https://rpc.thorchain.info" },
  { id: "kava_2222-10", name: "Kava", rpc: "https://rpc.kava.io" },
  { id: "fetchhub-4", name: "Fetch.ai", rpc: "https://rpc-fetchhub.fetch.ai" },
  { id: "secret-4", name: "Secret Network", rpc: "https://rpc.secret.express" },
  { id: "akashnet-2", name: "Akash", rpc: "https://rpc.akash.forbole.com" },
  { id: "core-1", name: "Persistence", rpc: "https://rpc.core.persistence.one" },
  { id: "axelar-dojo-1", name: "Axelar", rpc: "https://rpc-axelar.keplr.app" }
];

// Cache para preços
let cryptoPricesCache: Record<string, CryptoPriceData> = {};

// Armazenamento de saldos por chain
const balancesStore: Record<string, Balance[]> = {};

export const formatBalance = (amount: string, denom: string) => {
  if (denom.startsWith("u")) {
    const displayDenom = denom.slice(1).toUpperCase();
    const displayAmount = (parseInt(amount) / 1e6).toFixed(6);
    return { amount: displayAmount, denom: displayDenom };
  }
  return { amount, denom };
};

export const AssetsService = {
  getAllTokenMetadata: (): TokenInfo[] => CORE_TOKENS,

  getTokenById: (id: string): TokenInfo | undefined => {
    return CORE_TOKENS.find(token => token.id === id);
  },

  getTokensByChain: (chainId: string): TokenInfo[] => {
    return CORE_TOKENS.filter(token => token.chain === chainId);
  },

  getHighlightedTokens: (): TokenInfo[] => {
    return CORE_TOKENS.filter(token => token.highlight);
  },

  setBalances: (chainId: string, balances: Balance[]): void => {
    balancesStore[chainId] = balances;
  },

  getBalances: (chainId: string): Balance[] => {
    return balancesStore[chainId] || [];
  },

  findTokenInfo: (denom: string, chainId: string): TokenInfo | undefined => {
    const symbol = denom.startsWith('u') ? denom.slice(1).toUpperCase() : denom;
    return CORE_TOKENS.find(token => 
      token.symbol === symbol && token.chain === chainId
    ) || {
      id: denom,
      name: denom,
      symbol: denom,
      icon: 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png',
      chain: chainId
    };
  },

  updatePrices: (prices: Record<string, CryptoPriceData>): void => {
    cryptoPricesCache = prices;
  },

  getPrice: (tokenId: string): CryptoPriceData | undefined => {
    return cryptoPricesCache[tokenId];
  },

  getFormattedBalance: (tokenId: string, chainId: string): { amount: string; denom: string } => {
    const balances = balancesStore[chainId] || [];
    const token = CORE_TOKENS.find(t => t.id === tokenId && t.chain === chainId);
    
    if (!token) return { amount: '0', denom: 'UNKNOWN' };

    const balance = balances.find(b => {
      const denom = b.denom.startsWith('u') ? b.denom.slice(1).toUpperCase() : b.denom;
      return denom === token.symbol;
    });

    return balance 
      ? formatBalance(balance.amount, balance.denom)
      : { amount: '0', denom: token.symbol };
  },

  getAssetInfo: (tokenId: string, chainId: string) => {
    const token = AssetsService.getTokenById(tokenId);
    const balance = AssetsService.getFormattedBalance(tokenId, chainId);
    const price = AssetsService.getPrice(tokenId);

    return {
      token,
      balance,
      price,
      value: price ? (parseFloat(balance.amount) * price.usd): 0
    };
  }
};

export const useAssets = () => {
  return {
    getTokenById: AssetsService.getTokenById,
    getTokensByChain: AssetsService.getTokensByChain,
    getHighlightedTokens: AssetsService.getHighlightedTokens,
    getFormattedBalance: AssetsService.getFormattedBalance,
    getAssetInfo: AssetsService.getAssetInfo
  };
};
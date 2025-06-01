// src/services/assetsService.ts
import axios from 'axios';

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
  coingeckoId?: string; // Novo campo para mapeamento com CoinGecko
  highlight?: boolean;
}

export interface CryptoPriceData {
  usd: number;
  usd_24h_change: number;
}

// Configurações da API
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const OSMOSIS_API = 'https://api-osmosis.imperator.co';

// Top 10 tokens da Osmosis com mapeamento para CoinGecko
const CORE_TOKENS: TokenInfo[] = [
  {
    id: 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
    name: 'Cosmos Hub',
    symbol: 'ATOM',
    coingeckoId: 'cosmos',
    icon: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png?1555657960',
    chain: 'osmosis-1',
    highlight: true
  },
  {
    id: 'uosmo',
    name: 'Osmosis',
    symbol: 'OSMO',
    coingeckoId: 'osmosis',
    icon: 'https://assets.coingecko.com/coins/images/16724/large/osmo.png?1632763885',
    chain: 'osmosis-1',
    highlight: true
  },
  {
    id: 'ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858',
    name: 'USD Coin',
    symbol: 'USDC',
    coingeckoId: 'usd-coin',
    icon: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
    chain: 'osmosis-1',
    highlight: true
  },
  {
    id: 'ibc/4F393C3FCA4190C0A6756CE7F6D897D5D1BE57D6CCB80D0BC87393566A7B6602',
    name: 'Tether',
    symbol: 'USDT',
    coingeckoId: 'tether',
    icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
    chain: 'osmosis-1',
    highlight: false
  },
  {
    id: 'ibc/71F11F0E8F6E05D18C9F7F808D6909F21A5B0A6F7A78B4387582E4F704B19984',
    name: 'Sei Network',
    symbol: 'SEI',
    coingeckoId: 'sei-network',
    icon: 'https://assets.coingecko.com/coins/images/28205/large/Sei_Logo_-_Transparent.png?1696527207',
    chain: 'osmosis-1',
    highlight: false
  },
  {
    id: 'ibc/662914D0C1CEBCB070C68F061D035E8B10A07C79AB286E7342C85F3BE74612C5',
    name: 'Kujira',
    symbol: 'KUJI',
    coingeckoId: 'kujira',
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/kuji.png',
    chain: 'osmosis-1',
    highlight: false
  },
  {
    id: 'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
    name: 'Terra Classic',
    symbol: 'LUNA',
    coingeckoId: 'terra-luna',
    icon: 'https://assets.coingecko.com/coins/images/8284/large/01_LunaClassic_color.png?1653547790',
    chain: 'osmosis-1',
    highlight: false
  },
  {
    id: 'ibc/3A6D3358D4F1BE5D142985A330EE1D412C431F8356F6680F8D3D1495BB85E321',
    name: 'Picasso',
    symbol: 'PICA',
    coingeckoId: 'picasso',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21610.png',
    chain: 'osmosis-1',
    highlight: false
  },
  {
    id: 'ibc/3FDD002A3A4019B05A33D324B2F29748E77AF501BEA5C96D1F28B2D6755F9F25',
    name: 'Stride',
    symbol: 'STRD',
    coingeckoId: 'stride',
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.png',
    chain: 'osmosis-1',
    highlight: false
  },
  {
    id: 'ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4',
    name: 'Stargaze',
    symbol: 'STARS',
    coingeckoId: 'stargaze',
    icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png',
    chain: 'osmosis-1',
    highlight: false
  }
];

// Chains suportadas
export const SUPPORTED_CHAINS = [
  { id: "osmosis-1", name: "Osmosis", rpc: "https://rpc.osmosis.zone" }
];

// Cache para preços
let cryptoPricesCache: Record<string, CryptoPriceData> = {};

// Armazenamento de saldos
const balancesStore: Record<string, Balance[]> = {};

export const formatBalance = (amount: string, denom: string) => {
  if (denom.startsWith("u")) {
    const displayDenom = denom.slice(1).toUpperCase();
    const displayAmount = (parseInt(amount) / 1e6).toFixed(6);
    return { amount: displayAmount, denom: displayDenom };
  }
  return { amount, denom };
};

// Busca preços da CoinGecko
const fetchCoingeckoPrices = async () => {
  try {
    const ids = CORE_TOKENS.map(t => t.coingeckoId).filter(Boolean).join(',');
    const response = await axios.get(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching CoinGecko prices:', error);
    return {};
  }
};

// Busca preços da Osmosis API
const fetchOsmosisPrices = async () => {
  try {
    const response = await axios.get(`${OSMOSIS_API}/tokens/v2/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Osmosis prices:', error);
    return [];
  }
};

// Atualiza os preços combinando ambas as fontes
export const updateTokenPrices = async () => {
  const [coingeckoPrices, osmosisPrices] = await Promise.all([
    fetchCoingeckoPrices(),
    fetchOsmosisPrices()
  ]);

  const newPrices: Record<string, CryptoPriceData> = {};

  CORE_TOKENS.forEach(token => {
    // Tenta obter da Osmosis API primeiro (mais preciso para pools)
    const osmosisToken = osmosisPrices.find((t: any) => t.denom === token.id);
    if (osmosisToken) {
      newPrices[token.id] = {
        usd: parseFloat(osmosisToken.price),
        usd_24h_change: parseFloat(osmosisToken.price_24h_change)
      };
    }
    // Fallback para CoinGecko
    else if (token.coingeckoId && coingeckoPrices[token.coingeckoId]) {
      newPrices[token.id] = {
        usd: coingeckoPrices[token.coingeckoId].usd,
        usd_24h_change: coingeckoPrices[token.coingeckoId].usd_24h_change
      };
    }
  });

  cryptoPricesCache = newPrices;
  return newPrices;
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
    return CORE_TOKENS.find(token => 
      token.id === denom && token.chain === chainId
    ) || {
      id: denom,
      name: denom,
      symbol: denom,
      icon: 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png',
      chain: chainId
    };
  },

  updatePrices: async (): Promise<Record<string, CryptoPriceData>> => {
    return await updateTokenPrices();
  },

  getPrice: (tokenId: string): CryptoPriceData | undefined => {
    return cryptoPricesCache[tokenId];
  },

  getFormattedBalance: (tokenId: string, chainId: string): { amount: string; denom: string } => {
    const balances = balancesStore[chainId] || [];
    const token = CORE_TOKENS.find(t => t.id === tokenId && t.chain === chainId);
    
    if (!token) return { amount: '0', denom: 'UNKNOWN' };

    const balance = balances.find(b => b.denom === token.id);

    return balance 
      ? formatBalance(balance.amount, balance.denom)
      : { amount: '0', denom: token.symbol };
  },

  getAssetInfo: async (tokenId: string, chainId: string) => {
    const token = AssetsService.getTokenById(tokenId);
    const balance = AssetsService.getFormattedBalance(tokenId, chainId);
    
    // Atualiza os preços antes de buscar
    await AssetsService.updatePrices();
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
    getAssetInfo: AssetsService.getAssetInfo,
    updatePrices: AssetsService.updatePrices
  };
};
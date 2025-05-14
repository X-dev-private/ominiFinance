// src/services/assetsService.ts

// Tipos para os ativos
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
  
  // Dados estáticos dos tokens
  const CORE_TOKENS: TokenInfo[] = [
    // Tokens Cosmos
    {
      id: 'cosmos',
      name: 'Cosmos',
      symbol: 'ATOM',
      icon: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png?1555657960',
      chain: 'cosmoshub-4',
      highlight: true
    },
    {
      id: 'osmosis',
      name: 'Osmosis',
      symbol: 'OSMO',
      icon: 'https://assets.coingecko.com/coins/images/16724/large/osmo.png?1632763885',
      chain: 'osmosis-1',
      highlight: true
    },
    {
      id: 'juno-network',
      name: 'Juno',
      symbol: 'JUNO',
      icon: 'https://assets.coingecko.com/coins/images/19249/large/juno.png?1642838082',
      chain: 'juno-1',
      highlight: true
    },
    {
      id: 'secret',
      name: 'Secret',
      symbol: 'SCRT',
      icon: 'https://assets.coingecko.com/coins/images/11871/large/Secret.png?1595520186',
      chain: 'secret-4',
      highlight: true
    },
    // Tokens gerais
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
      chain: 'bitcoin',
      highlight: true
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
      chain: 'ethereum',
      highlight: true
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422',
      chain: 'solana'
    },
    // Adicione outros tokens conforme necessário
  ];
  
  // Chains suportadas
  export const SUPPORTED_CHAINS = [
    { id: "cosmoshub-4", name: "Cosmos Hub", rpc: "https://rpc.cosmos.network" },
    { id: "osmosis-1", name: "Osmosis", rpc: "https://rpc.osmosis.zone" },
    { id: "juno-1", name: "Juno", rpc: "https://rpc-juno.itastakers.com" },
    { id: "secret-4", name: "Secret Network", rpc: "https://rpc.secret.express" }
  ];
  
  // Cache para preços
  let cryptoPricesCache: Record<string, CryptoPriceData> = {};
  
  // Armazenamento de saldos por chain
  const balancesStore: Record<string, Balance[]> = {};
  
  // Função para formatar saldos
  export const formatBalance = (amount: string, denom: string) => {
    if (denom.startsWith("u")) {
      const displayDenom = denom.slice(1).toUpperCase();
      const displayAmount = (parseInt(amount) / 1e6).toFixed(6);
      return { amount: displayAmount, denom: displayDenom };
    }
    return { amount, denom };
  };
  
  // Serviço principal
  export const AssetsService = {
    // Obtém todos os metadados de tokens
    getAllTokenMetadata: (): TokenInfo[] => {
      return CORE_TOKENS;
    },
  
    // Obtém metadados de um token específico por ID
    getTokenById: (id: string): TokenInfo | undefined => {
      return CORE_TOKENS.find(token => token.id === id);
    },
  
    // Obtém metadados de tokens por chain
    getTokensByChain: (chainId: string): TokenInfo[] => {
      return CORE_TOKENS.filter(token => token.chain === chainId);
    },
  
    // Obtém metadados de tokens destacados
    getHighlightedTokens: (): TokenInfo[] => {
      return CORE_TOKENS.filter(token => token.highlight);
    },
  
    // Armazena saldos para uma chain específica
    setBalances: (chainId: string, balances: Balance[]): void => {
      balancesStore[chainId] = balances;
    },
  
    // Obtém saldos para uma chain específica
    getBalances: (chainId: string): Balance[] => {
      return balancesStore[chainId] || [];
    },
  
    // Encontra informações de token pelo denom
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
  
    // Atualiza cache de preços
    updatePrices: (prices: Record<string, CryptoPriceData>): void => {
      cryptoPricesCache = prices;
    },
  
    // Obtém preço de um token
    getPrice: (tokenId: string): CryptoPriceData | undefined => {
      return cryptoPricesCache[tokenId];
    },
  
    // Obtém saldo formatado de um token específico
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
  
    // Obtém informações completas de um ativo (incluindo saldo e preço)
    getAssetInfo: (tokenId: string, chainId: string) => {
      const token = AssetsService.getTokenById(tokenId);
      const balance = AssetsService.getFormattedBalance(tokenId, chainId);
      const price = AssetsService.getPrice(tokenId);
  
      return {
        token,
        balance,
        price,
        value: price ? (parseFloat(balance.amount) * price.usd : 0
      };
    }
  };
  
  // Hook para uso em componentes React
  export const useAssets = () => {
    return {
      getTokenById: AssetsService.getTokenById,
      getTokensByChain: AssetsService.getTokensByChain,
      getHighlightedTokens: AssetsService.getHighlightedTokens,
      getFormattedBalance: AssetsService.getFormattedBalance,
      getAssetInfo: AssetsService.getAssetInfo
    };
  };
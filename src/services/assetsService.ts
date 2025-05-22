// src/services/assetsService.ts

// Tipos para os ativos (mantidos iguais)
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

// Dados estáticos dos tokens (com 50+ tokens Cosmos)
const CORE_TOKENS: TokenInfo[] = [
  // Tokens principais (highlight)
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

  // ===== TOKENS COSMOS ECOSYSTEM (MAINNET) =====
  // Highlighted Cosmos tokens
  {
    id: 'fetch-ai',
    name: 'Fetch.ai',
    symbol: 'FET',
    icon: 'https://assets.coingecko.com/coins/images/5681/large/Fetch.jpg?1622079613',
    chain: 'fetchhub-4',
    highlight: true
  },
  {
    id: 'injective-protocol',
    name: 'Injective',
    symbol: 'INJ',
    icon: 'https://assets.coingecko.com/coins/images/12882/large/injective_logo.jpg?1603255762',
    chain: 'injective-1',
    highlight: true
  },
  {
    id: 'thorchain',
    name: 'THORChain',
    symbol: 'RUNE',
    icon: 'https://assets.coingecko.com/coins/images/6595/large/RUNE.png?1614160507',
    chain: 'thorchain-mainnet-v1',
    highlight: true
  },
  {
    id: 'terra-luna-2',
    name: 'Terra',
    symbol: 'LUNA',
    icon: 'https://assets.coingecko.com/coins/images/25767/large/luna.png?1653555172',
    chain: 'phoenix-1',
    highlight: true
  },
  {
    id: 'akash-network',
    name: 'Akash Network',
    symbol: 'AKT',
    icon: 'https://assets.coingecko.com/coins/images/12785/large/akash-logo.png?1625447679',
    chain: 'akashnet-2',
    highlight: true
  },
  {
    id: 'persistence',
    name: 'Persistence',
    symbol: 'XPRT',
    icon: 'https://assets.coingecko.com/coins/images/13827/large/persistence_logo.png?1612178319',
    chain: 'core-1',
    highlight: true
  },
  {
    id: 'kava',
    name: 'Kava',
    symbol: 'KAVA',
    icon: 'https://assets.coingecko.com/coins/images/9761/large/kava.png?1663638871',
    chain: 'kava_2222-10',
    highlight: true
  },
  {
    id: 'secret',
    name: 'Secret Network',
    symbol: 'SCRT',
    icon: 'https://assets.coingecko.com/coins/images/11871/large/Secret.png?1595520186',
    chain: 'secret-4',
    highlight: true
  },
  {
    id: 'stargaze',
    name: 'Stargaze',
    symbol: 'STARS',
    icon: 'https://assets.coingecko.com/coins/images/21763/large/stargaze.jpg?1641003208',
    chain: 'stargaze-1',
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
    id: 'evmos',
    name: 'Evmos',
    symbol: 'EVMOS',
    icon: 'https://assets.coingecko.com/coins/images/24023/large/evmos.png?1653958927',
    chain: 'evmos_9001-2',
    highlight: true
  },
  {
    id: 'axelar',
    name: 'Axelar',
    symbol: 'AXL',
    icon: 'https://assets.coingecko.com/coins/images/24456/large/axelar.png?1663015140',
    chain: 'axelar-dojo-1',
    highlight: true
  },

  // Outros tokens Cosmos
  {
    id: 'comdex',
    name: 'Comdex',
    symbol: 'CMDX',
    icon: 'https://assets.coingecko.com/coins/images/20357/large/cmdx.png?1636949204',
    chain: 'comdex-1'
  },
  {
    id: 'agoric',
    name: 'Agoric',
    symbol: 'BLD',
    icon: 'https://assets.coingecko.com/coins/images/21981/large/bld.png?1640568082',
    chain: 'agoric-3'
  },
  {
    id: 'umee',
    name: 'Umee',
    symbol: 'UMEE',
    icon: 'https://assets.coingecko.com/coins/images/20351/large/umee.png?1636947162',
    chain: 'umee-1'
  },
  {
    id: 'stafi',
    name: 'StaFi',
    symbol: 'FIS',
    icon: 'https://assets.coingecko.com/coins/images/12423/large/stafi_logo.jpg?1599730991',
    chain: 'stafihub-1'
  },
  {
    id: 'regen',
    name: 'Regen Network',
    symbol: 'REGEN',
    icon: 'https://assets.coingecko.com/coins/images/16752/large/regen.png?1624903522',
    chain: 'regen-1'
  },
  {
    id: 'desmos',
    name: 'Desmos',
    symbol: 'DSM',
    icon: 'https://assets.coingecko.com/coins/images/17151/large/dsm.png?1626262456',
    chain: 'desmos-mainnet'
  },
  {
    id: 'likecoin',
    name: 'LikeCoin',
    symbol: 'LIKE',
    icon: 'https://assets.coingecko.com/coins/images/13412/large/likecoin.png?1608243006',
    chain: 'likecoin-mainnet-2'
  },
  {
    id: 'bitcanna',
    name: 'BitCanna',
    symbol: 'BCNA',
    icon: 'https://assets.coingecko.com/coins/images/12391/large/bitcanna.png?1599495857',
    chain: 'bitcanna-1'
  },
  {
    id: 'cheqd',
    name: 'cheqd',
    symbol: 'CHEQ',
    icon: 'https://assets.coingecko.com/coins/images/18026/large/Cheqd_Logo_Circle_Green_CMYK.png?1629652434',
    chain: 'cheqd-mainnet-1'
  },
  {
    id: 'konstellation',
    name: 'Konstellation',
    symbol: 'DARC',
    icon: 'https://assets.coingecko.com/coins/images/14629/large/kono.png?1617341566',
    chain: 'darchub'
  },
  {
    id: 'rizon',
    name: 'Rizon',
    symbol: 'ATOLO',
    icon: 'https://assets.coingecko.com/coins/images/15210/large/rizon.png?1620335313',
    chain: 'titan-1'
  },
  {
    id: 'medibloc',
    name: 'MediBloc',
    symbol: 'MED',
    icon: 'https://assets.coingecko.com/coins/images/1374/large/medibloc_basic.png?1570607623',
    chain: 'panacea-3'
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    symbol: 'DVPN',
    icon: 'https://assets.coingecko.com/coins/images/8485/large/dvpn.png?1547563000',
    chain: 'sentinelhub-2'
  },
  {
    id: 'vidulum',
    name: 'Vidulum',
    symbol: 'VDL',
    icon: 'https://assets.coingecko.com/coins/images/12459/large/vdl.png?1599798245',
    chain: 'vidulum-1'
  },
  {
    id: 'dig-chain',
    name: 'Dig Chain',
    symbol: 'DIG',
    icon: 'https://assets.coingecko.com/coins/images/18769/large/dig.png?1633354263',
    chain: 'dig-1'
  },
  {
    id: 'gravity-bridge',
    name: 'Gravity Bridge',
    symbol: 'GRAV',
    icon: 'https://assets.coingecko.com/coins/images/19070/large/grav.png?1634549134',
    chain: 'gravity-bridge-3'
  },
  {
    id: 'assetmantle',
    name: 'AssetMantle',
    symbol: 'MNTL',
    icon: 'https://assets.coingecko.com/coins/images/24757/large/mntl.png?1648780436',
    chain: 'mantle-1'
  },
  {
    id: 'decentr',
    name: 'Decentr',
    symbol: 'DEC',
    icon: 'https://assets.coingecko.com/coins/images/11857/large/Decentr.png?1599968439',
    chain: 'mainnet-3'
  },
  {
    id: 'band-protocol',
    name: 'Band Protocol',
    symbol: 'BAND',
    icon: 'https://assets.coingecko.com/coins/images/9545/large/band-protocol.png?1568730326',
    chain: 'laozi-mainnet'
  },
  {
    id: 'cerberus-2',
    name: 'Cerberus',
    symbol: 'CRBRUS',
    icon: 'https://assets.coingecko.com/coins/images/15762/large/cerberus.png?1635794242',
    chain: 'cerberus-chain-1'
  },
  {
    id: 'chihuahua-chain',
    name: 'Chihuahua',
    symbol: 'HUAHUA',
    icon: 'https://assets.coingecko.com/coins/images/21161/large/chihuahua.jpg?1638379425',
    chain: 'chihuahua-1'
  },
  {
    id: 'iris-network',
    name: 'IRISnet',
    symbol: 'IRIS',
    icon: 'https://assets.coingecko.com/coins/images/5135/large/IRIS.png?1557999365',
    chain: 'irishub-1'
  },
  {
    id: 'ki-chain',
    name: 'Ki',
    symbol: 'XKI',
    icon: 'https://assets.coingecko.com/coins/images/14895/large/kichain.png?1618888758',
    chain: 'kichain-2'
  },
  {
    id: 'lum-network',
    name: 'Lum Network',
    symbol: 'LUM',
    icon: 'https://assets.coingecko.com/coins/images/16225/large/Lum.png?1623204048',
    chain: 'lum-network-1'
  },
  {
    id: 'provenance',
    name: 'Provenance',
    symbol: 'HASH',
    icon: 'https://assets.coingecko.com/coins/images/12127/large/pio.png?1597963353',
    chain: 'pio-mainnet-1'
  },
  {
    id: 'quicksilver',
    name: 'Quicksilver',
    symbol: 'QCK',
    icon: 'https://assets.coingecko.com/coins/images/29881/large/quicksilver.png?1680096106',
    chain: 'quicksilver-2'
  },
  {
    id: 'sifchain',
    name: 'Sifchain',
    symbol: 'ROWAN',
    icon: 'https://assets.coingecko.com/coins/images/14044/large/rowan.png?1614652079',
    chain: 'sifchain-1'
  },
  {
    id: 'starname',
    name: 'Starname',
    symbol: 'IOV',
    icon: 'https://assets.coingecko.com/coins/images/11841/large/starname.jpg?1596044694',
    chain: 'iov-mainnet-ibc'
  },
  {
    id: 'teritori',
    name: 'Teritori',
    symbol: 'TORI',
    icon: 'https://assets.coingecko.com/coins/images/25880/large/logo_%281%29.png?1654836361',
    chain: 'teritori-1'
  },
  {
    id: 'odin-protocol',
    name: 'Odin Protocol',
    symbol: 'ODIN',
    icon: 'https://assets.coingecko.com/coins/images/18792/large/odin.png?1633456733',
    chain: 'odin-mainnet-freya'
  },
  {
    id: 'planq',
    name: 'Planq',
    symbol: 'PLQ',
    icon: 'https://assets.coingecko.com/coins/images/28621/large/planq.PNG?1673259576',
    chain: 'planq_7070-2'
  },
  {
    id: 'shareledger',
    name: 'Shareledger',
    symbol: 'SHARE',
    icon: 'https://assets.coingecko.com/coins/images/18799/large/logo_%281%29.png?1633506316',
    chain: 'ShareRing-VoyagerNet'
  },
  {
    id: 'stride',
    name: 'Stride',
    symbol: 'STRD',
    icon: 'https://assets.coingecko.com/coins/images/26568/large/stride.png?1658908046',
    chain: 'stride-1'
  },
  {
    id: 'terp-network',
    name: 'Terp Network',
    symbol: 'TERP',
    icon: 'https://assets.coingecko.com/coins/images/28206/large/terp.png?1668511237',
    chain: 'morocco-1'
  },
  {
    id: 'tgrade',
    name: 'Tgrade',
    symbol: 'TGD',
    icon: 'https://assets.coingecko.com/coins/images/18828/large/tgrade.PNG?1633565876',
    chain: 'tgrade-mainnet-1'
  },
  {
    id: 'white-whale',
    name: 'White Whale',
    symbol: 'WHALE',
    icon: 'https://assets.coingecko.com/coins/images/22267/large/white-whale.png?1641478624',
    chain: 'migaloo-1'
  },

  // Outros tokens importantes (mantidos da versão anterior)
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422',
    chain: 'solana'
  },
  // ... (outros tokens não-Cosmos podem ser mantidos aqui)
];

// Chains suportadas (atualizada com redes Cosmos)
export const SUPPORTED_CHAINS = [
  // Chains Cosmos
  { id: "cosmoshub-4", name: "Cosmos Hub", rpc: "https://rpc.cosmos.network" },
  { id: "osmosis-1", name: "Osmosis", rpc: "https://rpc.osmosis.zone" },
  { id: "juno-1", name: "Juno", rpc: "https://rpc-juno.itastakers.com" },
  { id: "secret-4", name: "Secret Network", rpc: "https://rpc.secret.express" },
  { id: "fetchhub-4", name: "Fetch.ai", rpc: "https://rpc-fetchhub.fetch.ai" },
  { id: "injective-1", name: "Injective", rpc: "https://rpc.injective.network" },
  { id: "thorchain-mainnet-v1", name: "THORChain", rpc: "https://rpc.thorchain.info" },
  { id: "phoenix-1", name: "Terra 2.0", rpc: "https://terra2-rpc.lavenderfive.com" },
  { id: "akashnet-2", name: "Akash", rpc: "https://rpc.akash.forbole.com" },
  { id: "core-1", name: "Persistence", rpc: "https://rpc.core.persistence.one" },
  { id: "kava_2222-10", name: "Kava", rpc: "https://rpc.kava.io" },
  { id: "stargaze-1", name: "Stargaze", rpc: "https://rpc.stargaze-apis.com" },
  { id: "evmos_9001-2", name: "Evmos", rpc: "https://evmos-rpc.lavenderfive.com" },
  { id: "axelar-dojo-1", name: "Axelar", rpc: "https://rpc-axelar.keplr.app" },
  { id: "comdex-1", name: "Comdex", rpc: "https://rpc.comdex.one" },
  { id: "agoric-3", name: "Agoric", rpc: "https://main.rpc.agoric.net" },
  { id: "umee-1", name: "Umee", rpc: "https://rpc.umee.cc" },
  { id: "stafihub-1", name: "StaFi", rpc: "https://rpc.stafihub.io" },
  { id: "regen-1", name: "Regen", rpc: "https://rpc.regen.network" },
  { id: "desmos-mainnet", name: "Desmos", rpc: "https://rpc.mainnet.desmos.network" },
  { id: "likecoin-mainnet-2", name: "LikeCoin", rpc: "https://mainnet-node.like.co/rpc" },
  { id: "bitcanna-1", name: "BitCanna", rpc: "https://rpc.bitcanna.io" },
  { id: "cheqd-mainnet-1", name: "cheqd", rpc: "https://rpc.cheqd.net" },
  { id: "darchub", name: "Konstellation", rpc: "https://rpc.konstellation.tech" },
  { id: "titan-1", name: "Rizon", rpc: "https://rpcapi.rizon.world" },
  { id: "panacea-3", name: "MediBloc", rpc: "https://rpc.gopanacea.org" },
  { id: "sentinelhub-2", name: "Sentinel", rpc: "https://rpc-sentinel.keplr.app" },
  { id: "vidulum-1", name: "Vidulum", rpc: "https://mainnet-rpc.vidulum.app" },
  { id: "dig-1", name: "Dig Chain", rpc: "https://rpc-1-dig.notional.ventures" },
  { id: "gravity-bridge-3", name: "Gravity Bridge", rpc: "https://gravitychain.io:26657" },
  { id: "mantle-1", name: "AssetMantle", rpc: "https://rpc.assetmantle.one" },
  { id: "mainnet-3", name: "Decentr", rpc: "https://poseidon.mainnet.decentr.xyz" },
  { id: "laozi-mainnet", name: "Band Protocol", rpc: "https://rpc.laozi1.bandchain.org" },
  { id: "cerberus-chain-1", name: "Cerberus", rpc: "https://cerberus-rpc.polkachu.com" },
  { id: "chihuahua-1", name: "Chihuahua", rpc: "https://rpc.chihuahua.wtf" },
  { id: "irishub-1", name: "IRISnet", rpc: "https://rpc-iris.keplr.app" },
  { id: "kichain-2", name: "Ki", rpc: "https://rpc-mainnet.blockchain.ki" },
  { id: "lum-network-1", name: "Lum Network", rpc: "https://node0.mainnet.lum.network/rpc" },
  { id: "pio-mainnet-1", name: "Provenance", rpc: "https://rpc.provenance.io" },
  { id: "quicksilver-2", name: "Quicksilver", rpc: "https://rpc.quicksilver.zone" },
  { id: "sifchain-1", name: "Sifchain", rpc: "https://rpc.sifchain.finance" },
  { id: "iov-mainnet-ibc", name: "Starname", rpc: "https://rpc-iov.keplr.app" },
  { id: "teritori-1", name: "Teritori", rpc: "https://rpc.mainnet.teritori.com" },
  { id: "odin-mainnet-freya", name: "Odin Protocol", rpc: "https://mainnet.odinprotocol.io/rpc" },
  { id: "planq_7070-2", name: "Planq", rpc: "https://rpc.planq.network" },
  { id: "ShareRing-VoyagerNet", name: "Shareledger", rpc: "https://rpc.sharering.network" },
  { id: "stride-1", name: "Stride", rpc: "https://stride-rpc.polkachu.com" },
  { id: "morocco-1", name: "Terp Network", rpc: "https://rpc-terp.zenchainlabs.io" },
  { id: "tgrade-mainnet-1", name: "Tgrade", rpc: "https://rpc.mainnet-1.tgrade.confio.run" },
  { id: "migaloo-1", name: "White Whale", rpc: "https://rpc-whitewhale.keplr.app" },

  // Outras chains não-Cosmos
  { id: "bitcoin", name: "Bitcoin", rpc: "" },
  { id: "ethereum", name: "Ethereum", rpc: "https://eth.llamarpc.com" },
  { id: "solana", name: "Solana", rpc: "https://api.mainnet-beta.solana.com" },
  { id: "binance-smart-chain", name: "BNB Chain", rpc: "https://bsc-dataseed.binance.org/" },
  { id: "avalanche", name: "Avalanche", rpc: "https://api.avax.network/ext/bc/C/rpc" },
  { id: "polygon", name: "Polygon", rpc: "https://polygon-rpc.com" }
];

// ... (o restante do arquivo permanece igual)

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
      value: price ? (parseFloat(balance.amount) * price.usd) : 0
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
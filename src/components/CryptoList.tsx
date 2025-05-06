import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCryptoPrices } from '../services/cryptoService';

interface CryptoItem {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  highlight?: boolean; // Novo campo para destacar criptos específicas
}

const cryptoData: CryptoItem[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    highlight: true
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    highlight: true
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    symbol: 'ATOM',
    icon: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png?1555657960',
    highlight: true
  },
  {
    id: 'osmosis',
    name: 'Osmosis',
    symbol: 'OSMO',
    icon: 'https://assets.coingecko.com/coins/images/16724/large/osmo.png?1632763885',
    highlight: true
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422'
  },
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    icon: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    icon: 'https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860'
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    icon: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731'
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    icon: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png?1639712644'
  },
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    icon: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256'
  },
  {
    id: 'avalanche-2',
    name: 'Avalanche',
    symbol: 'AVAX',
    icon: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png?1670992574'
  },
  {
    id: 'polygon-pos',
    name: 'Polygon',
    symbol: 'MATIC',
    icon: 'https://assets.coingecko.com/coins/images/4713/large/polygon.png?1632459126'
  },
  {
    id: 'usd-coin',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389'
  }
];

const CryptoList: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: getCryptoPrices,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading data</div>;

  const handleAction = (action: 'buy' | 'sell' | 'swap', cryptoId: string) => {
    console.log(`${action} ${cryptoId}`);
    // Lógica de compra/venda/troca aqui
  };

  return (
    <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-sm rounded-xl shadow-md overflow-hidden p-4">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Top Cryptocurrencies</h2>
      <div className="space-y-4">
        {cryptoData.map((crypto) => (
          <div
            key={crypto.id}
            className={`flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors ${
              crypto.highlight ? 'border border-amber-400/30 bg-gradient-to-r from-black/30 to-black/10' : ''
            }`}
          >
            <div className="flex items-center space-x-4 min-w-[180px]">
              <div className={`w-10 h-10 flex-shrink-0 ${crypto.highlight ? 'ring-2 ring-amber-400 rounded-full' : ''}`}>
                <img 
                  src={crypto.icon} 
                  alt={crypto.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png';
                  }}
                />
              </div>
              <div>
                <h3 className={`font-medium ${crypto.highlight ? 'text-amber-400 text-lg' : 'text-white'}`}>
                  {crypto.name}
                </h3>
                <span className={`text-sm ${crypto.highlight ? 'text-amber-300' : 'text-gray-300'}`}>
                  {crypto.symbol}
                </span>
              </div>
            </div>

            <div className="text-center mx-4 min-w-[150px]">
              {data && data[crypto.id] ? (
                <>
                  <p className={`font-medium ${crypto.highlight ? 'text-amber-300 text-lg' : 'text-white'}`}>
                    ${data[crypto.id].usd.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </p>
                  <p
                    className={`text-sm ${
                      data[crypto.id].usd_24h_change >= 0 
                        ? crypto.highlight ? 'text-green-300' : 'text-green-400' 
                        : crypto.highlight ? 'text-red-300' : 'text-red-400'
                    }`}
                  >
                    {data[crypto.id].usd_24h_change >= 0 ? '+' : ''}
                    {data[crypto.id].usd_24h_change.toFixed(2)}%
                  </p>
                </>
              ) : (
                <p className="text-gray-400">-</p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleAction('buy', crypto.id)}
                className={`bg-gradient-to-r ${
                  crypto.highlight
                    ? 'from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 hover:shadow-amber-500/30'
                    : 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-emerald-500/30'
                } text-white font-medium py-2 px-5 rounded-full transition-all duration-300 
                transform hover:scale-105 shadow-lg`}
              >
                Buy
              </button>
              <button
                onClick={() => handleAction('sell', crypto.id)}
                className={`bg-gradient-to-r ${
                  crypto.highlight
                    ? 'from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 hover:shadow-orange-500/30'
                    : 'from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 hover:shadow-rose-500/30'
                } text-white font-medium py-2 px-5 rounded-full transition-all duration-300 
                transform hover:scale-105 shadow-lg`}
              >
                Sell
              </button>
              <button
                onClick={() => handleAction('swap', crypto.id)}
                className={`bg-gradient-to-r ${
                  crypto.highlight
                    ? 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-cyan-500/30'
                    : 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:shadow-indigo-500/30'
                } text-white font-medium py-2 px-5 rounded-full transition-all duration-300 
                transform hover:scale-105 shadow-lg`}
              >
                Swap
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoList;
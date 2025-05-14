import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCryptoPrices } from '../services/cryptoService';
import { AssetsService, TokenInfo } from '../services/assetsService';

const CryptoList: React.FC = () => {
  const { data: prices, isLoading, error } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: getCryptoPrices,
    staleTime: 1000 * 60 * 5,
  });

  // Obtém todos os tokens e filtra os destacados primeiro
  const allTokens = AssetsService.getAllTokenMetadata();
  const highlightedTokens = AssetsService.getHighlightedTokens();
  const otherTokens = allTokens.filter(token => !token.highlight);
  const sortedTokens = [...highlightedTokens, ...otherTokens];

  const handleAction = (action: 'buy' | 'sell' | 'swap', cryptoId: string) => {
    console.log(`${action} ${cryptoId}`);
    // Lógica de compra/venda/troca aqui
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8 bg-red-500/10 rounded-xl">
      <p className="text-red-400 font-medium">Error loading cryptocurrency data</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Cryptocurrency Market</h1>
          <p className="text-white/70 mt-1">Real-time prices and trading</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <p className="text-xs text-white/50">Total Market Cap</p>
            <p className="text-lg font-semibold text-white">
              {prices ? 
                `$${(Object.values(prices).reduce((sum, price) => sum + price.usd, 0) / 1e9).toFixed(2)}B` 
                : '-'
              }
            </p>
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <p className="text-xs text-white/50">24h Volume</p>
            <p className="text-lg font-semibold text-white">
              {prices ? 
                `$${(Object.values(prices).reduce((sum, price) => sum + price.usd, 0) / 1e8).toFixed(2)}B` 
                : '-'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.01] backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 border-b border-white/10">
          <div className="col-span-5 md:col-span-4 text-white/70 font-medium">Asset</div>
          <div className="col-span-3 text-right text-white/70 font-medium">Price</div>
          <div className="col-span-4 md:col-span-3 text-right text-white/70 font-medium">24h Change</div>
          <div className="col-span-3 text-right text-white/70 font-medium">Actions</div>
        </div>

        {/* Token Rows */}
        <div className="divide-y divide-white/10">
          {sortedTokens.map((token) => {
            const priceData = prices?.[token.id];
            const isPositive = priceData?.usd_24h_change >= 0;
            
            return (
              <div 
                key={token.id}
                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors ${
                  token.highlight ? 'bg-gradient-to-r from-amber-500/5 to-amber-500/3' : ''
                }`}
              >
                {/* Asset Info */}
                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                  <div className={`relative ${token.highlight ? 'ring-2 ring-amber-400' : ''} rounded-full w-10 h-10 overflow-hidden`}>
                    <img 
                      src={token.icon} 
                      alt={token.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png';
                      }}
                    />
                    {token.highlight && (
                      <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full w-4 h-4 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-medium ${token.highlight ? 'text-amber-300' : 'text-white'}`}>
                      {token.name}
                    </h3>
                    <p className="text-sm text-white/60">{token.symbol}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-3 text-right">
                  <p className={`font-medium ${token.highlight ? 'text-amber-200' : 'text-white'}`}>
                    {priceData ? `$${priceData.usd.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 6 
                    })}` : '-'}
                  </p>
                </div>

                {/* 24h Change */}
                <div className="col-span-4 md:col-span-3 text-right">
                  {priceData ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isPositive 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}
                    >
                      {isPositive ? (
                        <svg className="-ml-0.5 mr-1 h-3 w-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="-ml-0.5 mr-1 h-3 w-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {priceData.usd_24h_change.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-3 flex justify-end gap-2">
                  <button
                    onClick={() => handleAction('buy', token.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      token.highlight 
                        ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => handleAction('sell', token.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      token.highlight 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-rose-500 hover:bg-rose-600 text-white'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-4 rounded-xl border border-blue-500/20">
          <h3 className="text-blue-400 font-medium">Top Gainer (24h)</h3>
          {prices && (
            <>
              <p className="text-2xl font-bold text-white mt-2">
                {Object.entries(prices).reduce((a, b) => 
                  a[1].usd_24h_change > b[1].usd_24h_change ? a : b)[0]
                }
              </p>
              <p className="text-green-400 text-sm mt-1">
                +{Math.max(...Object.values(prices).map(p => p.usd_24h_change)).toFixed(2)}%
              </p>
            </>
          )}
        </div>
        <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 p-4 rounded-xl border border-red-500/20">
          <h3 className="text-red-400 font-medium">Top Loser (24h)</h3>
          {prices && (
            <>
              <p className="text-2xl font-bold text-white mt-2">
                {Object.entries(prices).reduce((a, b) => 
                  a[1].usd_24h_change < b[1].usd_24h_change ? a : b)[0]
                }
              </p>
              <p className="text-red-400 text-sm mt-1">
                {Math.min(...Object.values(prices).map(p => p.usd_24h_change)).toFixed(2)}%
              </p>
            </>
          )}
        </div>
        <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 p-4 rounded-xl border border-purple-500/20">
          <h3 className="text-purple-400 font-medium">Most Volatile</h3>
          {prices && (
            <>
              <p className="text-2xl font-bold text-white mt-2">
                {Object.entries(prices).reduce((a, b) => 
                  Math.abs(a[1].usd_24h_change) > Math.abs(b[1].usd_24h_change) ? a : b)[0]
                }
              </p>
              <p className="text-amber-400 text-sm mt-1">
                {Object.values(prices).reduce((a, b) => 
                  Math.abs(a.usd_24h_change) > Math.abs(b.usd_24h_change) ? a : b).usd_24h_change.toFixed(2)}%
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoList;
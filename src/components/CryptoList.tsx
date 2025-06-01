import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AssetsService, TokenInfo } from '../services/assetsService';

const CryptoList: React.FC = () => {
  const { data: prices, isLoading, error } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: () => AssetsService.updatePrices(), // Usa o novo método de atualização
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const allTokens = AssetsService.getAllTokenMetadata();
  const highlightedTokens = AssetsService.getHighlightedTokens();
  const otherTokens = allTokens.filter(token => !token.highlight);
  const sortedTokens = [...highlightedTokens, ...otherTokens];

  const handleAction = (action: 'buy' | 'sell' | 'swap', cryptoId: string) => {
    console.log(`${action} ${cryptoId}`);
    // Action logic here
  };

  const calculateCosmosStats = () => {
    if (!prices) return null;
    
    const cosmosTokens = allTokens;
    const cosmosPrices = cosmosTokens
      .map(token => prices[token.id])
      .filter(Boolean);

    if (cosmosPrices.length === 0) return null;

    return {
      totalMarketCap: cosmosPrices.reduce((sum, price) => sum + price.usd, 0),
      total24hChange: cosmosPrices.reduce((sum, price) => sum + price.usd_24h_change, 0) / cosmosPrices.length,
      topGainer: cosmosPrices.reduce((a, b) => a.usd_24h_change > b.usd_24h_change ? a : b),
      topLoser: cosmosPrices.reduce((a, b) => a.usd_24h_change < b.usd_24h_change ? a : b)
    };
  };

  const cosmosStats = calculateCosmosStats();

  if (isLoading) return (
    <div className="flex justify-center items-center h-64 bg-gray-900 rounded-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8 bg-gray-900 rounded-xl border border-gray-800">
      <p className="text-red-400 font-medium">Error loading cryptocurrency data</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Cosmos Ecosystem Market</h1>
          <p className="text-gray-700 mt-2">Interchain assets and prices</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-gray-900 px-5 py-3 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Cosmos Market Cap</p>
            <p className="text-xl font-semibold text-white mt-1">
              {cosmosStats ? `$${(cosmosStats.totalMarketCap / 1e9).toFixed(2)}B` : '-'}
            </p>
          </div>
          <div className="bg-gray-900 px-5 py-3 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Avg 24h Change</p>
            <p className={`text-xl font-semibold mt-1 ${
              cosmosStats?.total24hChange ? 
                cosmosStats.total24hChange >= 0 ? 'text-green-400' : 'text-red-400' 
                : 'text-white'
            }`}>
              {cosmosStats ? `${cosmosStats.total24hChange.toFixed(2)}%` : '-'}
            </p>
          </div>
          <div className="bg-gray-900 px-5 py-3 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total Assets</p>
            <p className="text-xl font-semibold text-white mt-1">{allTokens.length}</p>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-5 bg-gray-800 border-b border-gray-700">
          <div className="col-span-5 md:col-span-4 text-gray-400 font-medium uppercase tracking-wider text-sm">Asset</div>
          <div className="col-span-2 text-right text-gray-400 font-medium uppercase tracking-wider text-sm">Chain</div>
          <div className="col-span-2 text-right text-gray-400 font-medium uppercase tracking-wider text-sm">Price</div>
          <div className="col-span-3 text-right text-gray-400 font-medium uppercase tracking-wider text-sm">24h Change</div>
          <div className="col-span-2 text-right text-gray-400 font-medium uppercase tracking-wider text-sm">Actions</div>
        </div>

        {/* Token Rows */}
        <div className="divide-y divide-gray-800">
          {sortedTokens.map((token) => {
            const priceData = prices?.[token.id];
            const isPositive = priceData?.usd_24h_change >= 0;
            
            return (
              <div 
                key={token.id}
                className={`grid grid-cols-12 gap-4 p-5 items-center hover:bg-gray-850 transition-colors ${
                  token.highlight ? 'bg-gradient-to-r from-amber-900/20 to-amber-900/10' : ''
                }`}
              >
                {/* Asset Info */}
                <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                  <div className={`relative ${token.highlight ? 'ring-2 ring-amber-500' : ''} rounded-full w-10 h-10 overflow-hidden`}>
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
                    <h3 className={`font-medium ${token.highlight ? 'text-amber-400' : 'text-white'}`}>
                      {token.name}
                    </h3>
                    <p className="text-sm text-gray-400">{token.symbol}</p>
                  </div>
                </div>

                {/* Chain */}
                <div className="col-span-2 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                    {token.chain.split('-')[0]}
                  </span>
                </div>

                {/* Price */}
                <div className="col-span-2 text-right">
                  <p className={`font-mono ${token.highlight ? 'text-amber-300' : 'text-white'}`}>
                    {priceData ? `$${priceData.usd.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: priceData.usd < 1 ? 6 : 2 
                    })}` : '-'}
                  </p>
                </div>

                {/* 24h Change */}
                <div className="col-span-3 text-right">
                  {priceData ? (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isPositive 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}
                    >
                      {isPositive ? (
                        <svg className="mr-1.5 h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="mr-1.5 h-4 w-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {Math.abs(priceData.usd_24h_change).toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() => handleAction('buy', token.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      token.highlight 
                        ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => handleAction('sell', token.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      token.highlight 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
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
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
          <h3 className="text-blue-400 font-medium">Top Gainer (24h)</h3>
          {cosmosStats?.topGainer && (
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">
                {allTokens.find(t => prices?.[t.id] === cosmosStats.topGainer)?.symbol || '-'}
              </p>
              <div className="flex items-center mt-2">
                <svg className="h-5 w-5 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <p className="text-green-400 font-medium">
                  +{cosmosStats.topGainer.usd_24h_change.toFixed(2)}%
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
          <h3 className="text-red-400 font-medium">Top Loser (24h)</h3>
          {cosmosStats?.topLoser && (
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">
                {allTokens.find(t => prices?.[t.id] === cosmosStats.topLoser)?.symbol || '-'}
              </p>
              <div className="flex items-center mt-2">
                <svg className="h-5 w-5 text-red-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p className="text-red-400 font-medium">
                  {cosmosStats.topLoser.usd_24h_change.toFixed(2)}%
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
          <h3 className="text-purple-400 font-medium">Most Active</h3>
          {prices && (
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">OSMO</p>
              <p className={`text-lg font-medium mt-2 ${
                cosmosStats?.total24hChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {cosmosStats?.total24hChange.toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoList;
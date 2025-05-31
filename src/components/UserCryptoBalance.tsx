import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BalanceService } from '../services/balanceService';
import { AssetsService } from '../services/assetsService';

interface UserCryptoBalanceProps {
  walletAddress: string;
}

const UserCryptoBalance: React.FC<UserCryptoBalanceProps> = ({ walletAddress }) => {
  // Puxa os saldos do usuário usando o serviço
  const { data: balances, isLoading, error } = useQuery({
    queryKey: ['userCryptoBalances', walletAddress],
    queryFn: () => BalanceService.getUserBalances(walletAddress),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!walletAddress, // Só executa se tiver walletAddress
  });

  // Puxa os metadados dos tokens
  const allTokens = AssetsService.getAllTokenMetadata();

  // Combina os saldos com os metadados dos tokens
  const enrichedBalances = balances?.map(balance => {
    const tokenInfo = allTokens.find(token => token.denom === balance.denom);
    return {
      ...balance,
      ...tokenInfo,
      value: balance.amount * (tokenInfo?.currentPrice || 0),
    };
  }) || [];

  // Calcula o valor total do portfolio
  const totalPortfolioValue = enrichedBalances.reduce(
    (sum, balance) => sum + balance.value,
    0
  );

  if (isLoading) return (
    <div className="flex justify-center items-center h-64 bg-gray-900 rounded-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8 bg-gray-900 rounded-xl border border-gray-800">
      <p className="text-red-400 font-medium">Error loading balance data</p>
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
      {/* Portfolio Summary */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Your Crypto Portfolio</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[200px]">
            <p className="text-gray-400 text-sm">Total Value</p>
            <p className="text-2xl font-bold text-white">
              ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <p className="text-gray-400 text-sm">Assets</p>
            <p className="text-2xl font-bold text-white">{enrichedBalances.length}</p>
          </div>
        </div>
      </div>

      {/* Balances List */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-5 bg-gray-800 border-b border-gray-700">
          <div className="col-span-5 text-gray-400 font-medium uppercase tracking-wider text-sm">Asset</div>
          <div className="col-span-3 text-right text-gray-400 font-medium uppercase tracking-wider text-sm">Balance</div>
          <div className="col-span-2 text-right text-gray-400 font-medium uppercase tracking-wider text-sm">Price</div>
          <div className="col-span-2 text-right text-gray-400 font-medium uppercase tracking-wider text-sm">Value</div>
        </div>

        {/* Balances Rows */}
        <div className="divide-y divide-gray-800">
          {enrichedBalances.map((balance) => (
            <div key={balance.denom} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-gray-850 transition-colors">
              {/* Asset Info */}
              <div className="col-span-5 flex items-center gap-4">
                <div className="rounded-full w-10 h-10 overflow-hidden">
                  <img 
                    src={balance.icon} 
                    alt={balance.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-white">{balance.name}</h3>
                  <p className="text-sm text-gray-400">{balance.symbol}</p>
                </div>
              </div>

              {/* Balance */}
              <div className="col-span-3 text-right">
                <p className="font-mono text-white">
                  {balance.amount.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </p>
              </div>

              {/* Price */}
              <div className="col-span-2 text-right">
                <p className="font-mono text-white">
                  ${balance.currentPrice?.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: balance.currentPrice < 1 ? 6 : 2 
                  }) || '-'}
                </p>
              </div>

              {/* Value */}
              <div className="col-span-2 text-right">
                <p className="font-mono text-white">
                  ${balance.value.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserCryptoBalance;
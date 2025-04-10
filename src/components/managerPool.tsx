// components/ManagerPool.tsx
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useCommunityPools } from '../utils/useCommunityPools';
import ApproveModal from './ApproveModal';

interface ManagerPoolProps {
  tokenAddress: string;
  tokenSymbol: string;
}

const ManagerPool: React.FC<ManagerPoolProps> = ({ tokenAddress, tokenSymbol }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<{
    name: string;
    fromAddress: string;
    toAddress: string;
    poolAddress: string;
    fromToken: string;
    toToken: string;
  } | null>(null);
  
  const { address } = useAccount();
  const {
    pools,
    loading,
    error,
    handleWithdrawFees,
    fetchPoolsByToken
  } = useCommunityPools();

  useEffect(() => {
    fetchPoolsByToken(tokenAddress);
  }, [fetchPoolsByToken, tokenAddress]);

  const handleDepositClick = (pool: any) => {
    setSelectedPool({
      name: `${pool.tokenA.symbol}/${pool.tokenB.symbol}`,
      fromAddress: pool.tokenA.address,
      toAddress: pool.tokenB.address,
      poolAddress: pool.address,
      fromToken: pool.tokenA.symbol,
      toToken: pool.tokenB.symbol
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading pools for {tokenSymbol}...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        {pools.length === 0 ? (
          <div className="text-center py-8">No pools found for {tokenSymbol}</div>
        ) : (
          pools.map((pool, index) => (
            <div key={index} className="rounded-2xl border border-green-300 shadow-lg p-6 bg-gradient-to-br from-white to-green-50 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <span className="mr-2 text-2xl">🟩</span>
                <span className="font-bold text-green-700 text-xl">
                  {pool.tokenA.symbol}/{pool.tokenB.symbol}
                </span>
                <span className="text-green-500 ml-2 text-sm">({pool.type})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <span className="block text-gray-600 text-sm">Volume</span>
                  <span className="font-semibold text-green-700">{pool.volume}</span>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <span className="block text-gray-600 text-sm">Fees</span>
                  <span className="font-semibold text-green-700">{pool.fees}</span>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <span className="block text-gray-600 text-sm">TVL</span>
                  <span className="font-semibold text-green-700">{pool.TVL}</span>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <span className="block text-gray-600 text-sm">APR</span>
                  <span className="font-semibold text-green-700">{pool.apr}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    onClick={() => handleDepositClick(pool)}
                  >
                    <span className="mr-2">💰</span>
                    Deposit
                  </button>
                  <button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    onClick={() => handleWithdrawFees(pool)}
                  >
                    <span className="mr-2">💸</span>
                    Withdraw Fees
                  </button>
                  {(pool.userFeesA !== "0" || pool.userFeesB !== "0") && (
                    <div className="text-xs text-gray-600 mt-2">
                      Your fees: {parseFloat(pool.userFeesA || "0").toFixed(6)} {pool.tokenA.symbol} / {parseFloat(pool.userFeesB || "0").toFixed(6)} {pool.tokenB.symbol}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && selectedPool && (
        <ApproveModal
          selectedPool={selectedPool}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManagerPool;
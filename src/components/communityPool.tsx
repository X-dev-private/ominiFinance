import React, { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { TOKEN_ADDRESSES } from '../config/tokenAddresses';
import ApproveModal from './ApproveModal';

interface TokenData {
  address: string;
  name: string;
  symbol: string;
  totalSupply: string;
  owner: string;
  isValid: boolean;
  decimals: number;
}

interface PoolData {
  address: string;
  tokenA: TokenData;
  tokenB: TokenData;
  reserveA: string;
  reserveB: string;
  fee: string;
  volume: string;
  fees: string;
  TVL: string;
  apr: string;
  type: string;
}

const CommunityPoolTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pools, setPools] = useState<PoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const chainId = useChainId();
  const chainData = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];
  const [selectedPool, setSelectedPool] = useState<{
    name: string;
    fromAddress: string;
    toAddress: string;
    poolAddress: string;
    fromToken: string;
    toToken: string;
  } | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!chainData?.dexFactory || !chainData?.tokenFactory) {
        setError("Unsupported network");
        setLoading(false);
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        
        // 1. Inicializa os contratos
        const poolFactory = new Contract(
          chainData.dexFactory,
          [
            "function getAllPools() view returns (address[] memory)",
            "function getPoolData(address) view returns (address,address,uint256,uint256,uint256,uint256,uint256,address)"
          ],
          provider
        );

        const tokenFactory = new Contract(
          chainData.tokenFactory,
          [
            "function getTokenByAddress(address) view returns (string,string,uint256,address,bool)"
          ],
          provider
        );

        // 2. Obtém todos os pools usando getAllPools()
        const allPoolAddresses = await poolFactory.getAllPools();
        
        // 3. Processa cada pool
        const processedPools = await Promise.all(
          allPoolAddresses.map(async (poolAddress: string) => {
            try {
              // 3.1 Obtém dados da pool usando getPoolData()
              const [
                tokenA, 
                tokenB, 
                reserveA, 
                reserveB, 
                feeNumerator, 
                feeDenominator
              ] = await poolFactory.getPoolData(poolAddress);

              // 3.2 Obtém dados dos tokens usando getTokenByAddress()
              const [tokenAData, tokenBData] = await Promise.all([
                getTokenData(tokenFactory, tokenA),
                getTokenData(tokenFactory, tokenB)
              ]);

              // 3.3 Calcula métricas da pool
              const feePercentage = (Number(feeNumerator) / Number(feeDenominator)) * 100;
              const feeString = feePercentage.toFixed(2) + '%';

              const reserveAFormatted = formatUnits(reserveA, tokenAData.decimals);
              const reserveBFormatted = formatUnits(reserveB, tokenBData.decimals);
              const reserveANum = parseFloat(reserveAFormatted) || 0;
              const reserveBNum = parseFloat(reserveBFormatted) || 0;
              const TVL = reserveANum + reserveBNum;

              return {
                address: poolAddress,
                tokenA: tokenAData,
                tokenB: tokenBData,
                reserveA: reserveAFormatted,
                reserveB: reserveBFormatted,
                fee: feeString,
                volume: `~$${(TVL * 0.2).toFixed(2)}`, // Volume estimado
                fees: `~$${(TVL * 0.002).toFixed(2)}`, // Taxas estimadas
                TVL: `~$${TVL.toFixed(2)}`,
                apr: `${(Math.random() * 30 + 5).toFixed(2)}%`, // APR simulado
                type: tokenAData.symbol === tokenBData.symbol ? "Stable" : "Volatile"
              };
            } catch (err) {
              console.error(`Error processing pool ${poolAddress}:`, err);
              return null;
            }
          })
        );

        setPools(processedPools.filter(Boolean) as PoolData[]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load pool data. Please try again.");
        setLoading(false);
      }
    };

    // Função auxiliar para obter dados completos de um token
    const getTokenData = async (tokenFactory: Contract, tokenAddress: string): Promise<TokenData> => {
      const [name, symbol, totalSupply, owner, isValid] = await tokenFactory.getTokenByAddress(tokenAddress);
      
      return {
        address: tokenAddress,
        name,
        symbol,
        totalSupply: formatUnits(totalSupply, 18), // Assumindo 18 decimais
        owner,
        isValid,
        decimals: 18
      };
    };

    fetchAllData();
  }, [chainData]);

  const handleDepositClick = (pool: PoolData) => {
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

  const handleWithdrawFees = async (pool: PoolData) => {
    if (!address || !window.ethereum) {
      alert('Please connect your wallet.');
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const poolContract = new Contract(
        pool.address,
        [
          {
            "inputs": [],
            "name": "withdrawFees",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        signer
      );

      const tx = await poolContract.withdrawFees();
      await tx.wait();
      alert('Fees withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing fees:', error);
      alert('Failed to withdraw fees.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading community pools...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="px-4 md:px-10 py-12 w-full mx-auto">
      <div className="space-y-6">
        {pools.map((pool, index) => (
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
              </div>
            </div>
          </div>
        ))}
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

export default CommunityPoolTable;
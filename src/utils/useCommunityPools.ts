import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import { TOKEN_ADDRESSES } from '../config/tokenAddresses';

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
  userFeesA?: string;
  userFeesB?: string;
}

interface PoolPair {
  tokenA: string;
  tokenB: string;
}

interface PoolFactoryFunctions {
  getAllPools: () => Promise<string[]>;
  getPoolData: (poolAddress: string) => Promise<any>;
  getPoolsByOwner: (ownerAddress: string) => Promise<string[]>;
  getPoolsByToken: (tokenAddress: string) => Promise<string[]>;
  getAllPoolPairs: () => Promise<PoolPair[]>;
  getTotalPools: () => Promise<number>;
  createPool: (tokenA: string, tokenB: string) => Promise<any>;
}

export const useCommunityPools = () => {
  const [pools, setPools] = useState<PoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const chainId = useChainId();
  const chainData = TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES];
  const [poolFactoryContract, setPoolFactoryContract] = useState<Contract | null>(null);
  const [tokenFactoryContract, setTokenFactoryContract] = useState<Contract | null>(null);

  // Initialize contracts
  useEffect(() => {
    if (!chainData?.dexFactory || !chainData?.tokenFactory) return;

    const initializeContracts = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        
        const poolFactory = new Contract(
          chainData.dexFactory,
          [
            "function getAllPools() view returns (address[] memory)",
            "function getPoolData(address) view returns (address,address,uint256,uint256,uint256,uint256,uint256,address)",
            "function getPoolsByOwner(address) view returns (address[] memory)",
            "function getPoolsByToken(address) view returns (address[] memory)",
            "function getAllPoolPairs() view returns (address[2][] memory)",
            "function getTotalPools() view returns (uint256)",
            "function createPool(address,address) external returns (address)"
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

        setPoolFactoryContract(poolFactory);
        setTokenFactoryContract(tokenFactory);
      } catch (err) {
        console.error("Error initializing contracts:", err);
        setError("Failed to initialize contracts");
      }
    };

    initializeContracts();
  }, [chainData]);

  const getTokenData = useCallback(async (tokenAddress: string): Promise<TokenData> => {
    if (!tokenFactoryContract) {
      throw new Error("Token factory contract not initialized");
    }

    const [name, symbol, totalSupply, owner, isValid] = await tokenFactoryContract.getTokenByAddress(tokenAddress);
    return {
      address: tokenAddress,
      name,
      symbol,
      totalSupply: formatUnits(totalSupply, 18),
      owner,
      isValid,
      decimals: 18
    };
  }, [tokenFactoryContract]);

  // Core pool processing function
  const processPoolData = useCallback(async (poolAddress: string): Promise<PoolData | null> => {
    if (!poolFactoryContract || !tokenFactoryContract) return null;

    try {
      const [
        tokenA, tokenB, reserveA, reserveB, 
        feeNumerator, feeDenominator
      ] = await poolFactoryContract.getPoolData(poolAddress);

      const [tokenAData, tokenBData] = await Promise.all([
        getTokenData(tokenA),
        getTokenData(tokenB)
      ]);

      const feePercentage = (Number(feeNumerator) / Number(feeDenominator)) * 100;
      const feeString = feePercentage.toFixed(2) + '%';

      const reserveAFormatted = formatUnits(reserveA, tokenAData.decimals);
      const reserveBFormatted = formatUnits(reserveB, tokenBData.decimals);
      const reserveANum = parseFloat(reserveAFormatted) || 0;
      const reserveBNum = parseFloat(reserveBFormatted) || 0;
      const TVL = reserveANum + reserveBNum;

      let userFeesA = "0";
      let userFeesB = "0";
      
      if (address) {
        try {
          const poolContract = new Contract(
            poolAddress,
            ["function getAvailableFees(address) view returns (uint256, uint256)"],
            poolFactoryContract.provider
          );
          
          const [feesA, feesB] = await poolContract.getAvailableFees(address);
          userFeesA = formatUnits(feesA, tokenAData.decimals);
          userFeesB = formatUnits(feesB, tokenBData.decimals);
        } catch (err) {
          console.error(`Error fetching fees for pool ${poolAddress}:`, err);
        }
      }

      return {
        address: poolAddress,
        tokenA: tokenAData,
        tokenB: tokenBData,
        reserveA: reserveAFormatted,
        reserveB: reserveBFormatted,
        fee: feeString,
        volume: `~$${(TVL * 0.2).toFixed(2)}`,
        fees: `~$${(TVL * 0.002).toFixed(2)}`,
        TVL: `~$${TVL.toFixed(2)}`,
        apr: `${(Math.random() * 30 + 5).toFixed(2)}%`,
        type: tokenAData.symbol === tokenBData.symbol ? "Stable" : "Volatile",
        userFeesA,
        userFeesB
      };
    } catch (err) {
      console.error(`Error processing pool ${poolAddress}:`, err);
      return null;
    }
  }, [poolFactoryContract, tokenFactoryContract, address, getTokenData]);

  // Main fetch functions
  const fetchPools = useCallback(async (poolAddresses: string[]): Promise<PoolData[]> => {
    setLoading(true);
    try {
      const processedPools = await Promise.all(
        poolAddresses.map(processPoolData)
      );
      const validPools = processedPools.filter(Boolean) as PoolData[];
      setPools(validPools);
      return validPools;
    } catch (err) {
      console.error("Error fetching pools:", err);
      setError("Failed to load pool data");
      return [];
    } finally {
      setLoading(false);
    }
  }, [processPoolData]);

  const fetchAllPools = useCallback(async (): Promise<PoolData[]> => {
    if (!poolFactoryContract) return [];
    const allPoolAddresses = await poolFactoryContract.getAllPools();
    return await fetchPools(allPoolAddresses);
  }, [poolFactoryContract, fetchPools]);

  const fetchPoolsByToken = useCallback(async (tokenAddress: string): Promise<PoolData[]> => {
    if (!poolFactoryContract) return [];
    const poolAddresses = await poolFactoryContract.getPoolsByToken(tokenAddress);
    return await fetchPools(poolAddresses);
  }, [poolFactoryContract, fetchPools]);

  const fetchPoolsByOwner = useCallback(async (ownerAddress: string): Promise<PoolData[]> => {
    if (!poolFactoryContract) return [];
    const poolAddresses = await poolFactoryContract.getPoolsByOwner(ownerAddress);
    return await fetchPools(poolAddresses);
  }, [poolFactoryContract, fetchPools]);

  // PoolFactory functions
  const poolFactoryFunctions: PoolFactoryFunctions = {
    getAllPools: useCallback(async (): Promise<string[]> => {
      if (!poolFactoryContract) return [];
      return await poolFactoryContract.getAllPools();
    }, [poolFactoryContract]),

    getPoolData: useCallback(async (poolAddress: string) => {
      if (!poolFactoryContract) return null;
      return await poolFactoryContract.getPoolData(poolAddress);
    }, [poolFactoryContract]),

    getPoolsByOwner: useCallback(async (ownerAddress: string): Promise<string[]> => {
      if (!poolFactoryContract) return [];
      return await poolFactoryContract.getPoolsByOwner(ownerAddress);
    }, [poolFactoryContract]),

    getPoolsByToken: useCallback(async (tokenAddress: string): Promise<string[]> => {
      if (!poolFactoryContract) return [];
      return await poolFactoryContract.getPoolsByToken(tokenAddress);
    }, [poolFactoryContract]),

    getAllPoolPairs: useCallback(async (): Promise<PoolPair[]> => {
      if (!poolFactoryContract) return [];
      const pairs = await poolFactoryContract.getAllPoolPairs();
      return pairs.map(([tokenA, tokenB]: [string, string]) => ({ tokenA, tokenB }));
    }, [poolFactoryContract]),

    getTotalPools: useCallback(async (): Promise<number> => {
      if (!poolFactoryContract) return 0;
      return await poolFactoryContract.getTotalPools();
    }, [poolFactoryContract]),

    createPool: useCallback(async (tokenA: string, tokenB: string) => {
      if (!poolFactoryContract || !window.ethereum) {
        throw new Error("Contract not initialized or wallet not connected");
      }
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factoryWithSigner = poolFactoryContract.connect(signer);
      return await factoryWithSigner.createPool(tokenA, tokenB);
    }, [poolFactoryContract])
  };

  const handleWithdrawFees = useCallback(async (pool: PoolData) => {
    if (!address || !window.ethereum || !poolFactoryContract) {
      alert('Please connect your wallet.');
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const poolContract = new Contract(
        pool.address,
        [{
          "inputs": [],
          "name": "withdrawFees",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }],
        signer
      );

      const tx = await poolContract.withdrawFees();
      await tx.wait();
      
      const updatedPool = await processPoolData(pool.address);
      if (updatedPool) {
        setPools(prev => prev.map(p => 
          p.address === pool.address ? updatedPool : p
        ));
      }
      
      alert('Fees withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing fees:', error);
      alert('Failed to withdraw fees.');
    }
  }, [address, processPoolData, poolFactoryContract]);

  useEffect(() => {
    if (poolFactoryContract) {
      fetchAllPools();
    }
  }, [poolFactoryContract, fetchAllPools]);

  return {
    pools,
    loading,
    error,
    
    fetchAllPools,
    fetchPoolsByToken,
    fetchPoolsByOwner,
    
    handleWithdrawFees,
    
    poolFactory: poolFactoryFunctions,

    getTokenData,
    processPoolData
  };
};